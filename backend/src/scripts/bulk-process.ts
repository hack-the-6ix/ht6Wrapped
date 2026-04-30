/**
 * Bulk-processes every project in Supabase:
 * fetches all commits within the hackathon window, computes stats,
 * and upserts one wrapped_stats row per project (whole-team aggregate).
 *
 * Run with: bun run src/scripts/bulk-process.ts
 */

import { createClient } from '@supabase/supabase-js'
import { parseRepoUrl, listCommits, getCommitLineStats, getLanguages, getRepoMeta } from '../services/github'
import { computeStats } from '../services/analytics'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const HACKATHON_START = new Date('2025-07-18T22:00:00-04:00')
const HACKATHON_END   = new Date('2025-07-20T09:30:00-04:00')
const TORONTO_TZ      = 'America/Toronto'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function computePercentilesFromExisting(
  shareId: string,
  totalCommits: number,
  repoSizeKb: number,
  languagesShare: Record<string, number>,
) {
  const { data: allRows } = await supabase
    .from('wrapped_stats')
    .select('total_commits, repo_size_kb, languages_share')
    .eq('status', 'done')

  const rows = allRows ?? []
  const total = rows.length || 1

  const commitPercentile = rows.filter(r => (r.total_commits ?? 0) < totalCommits).length / total
  const sizePercentile   = rows.filter(r => (r.repo_size_kb   ?? 0) < repoSizeKb  ).length / total

  const languagePercentiles: Record<string, number> = {}
  for (const [lang, share] of Object.entries(languagesShare)) {
    const below = rows.filter(r => ((r.languages_share as Record<string,number> | null)?.[lang] ?? 0) < share).length
    languagePercentiles[lang] = below / total
  }

  return { commitPercentile, sizePercentile, languagePercentiles }
}

async function processProject(project: { id: string; name: string; repo_url: string }, idx: number, total: number) {
  const tag = `[${idx}/${total}] ${project.name}`

  // Skip if already done
  const { data: existing } = await supabase
    .from('wrapped_stats')
    .select('id, status')
    .eq('project_id', project.id)
    .eq('status', 'done')
    .limit(1)
    .single()

  if (existing) {
    console.log(`  ${tag} — already done, skipping`)
    return
  }

  let owner: string, repo: string
  try {
    ;({ owner, repo } = parseRepoUrl(project.repo_url))
  } catch {
    console.warn(`  ${tag} — bad repo URL, skipping`)
    return
  }

  // Remove any stale pending/error rows so we start fresh
  await supabase
    .from('wrapped_stats')
    .delete()
    .eq('project_id', project.id)
    .in('status', ['pending', 'error', 'not_found'])

  const { data: row, error: insertErr } = await supabase
    .from('wrapped_stats')
    .insert({
      project_id:               project.id,
      github_username:          project.name,
      window_start:             HACKATHON_START.toISOString(),
      window_end:               HACKATHON_END.toISOString(),
      status:                   'pending',
      total_commits:            0,
      first_commit_at:          null,
      last_commit_at:           null,
      repo_lifespan_hours:      0,
      peak_commit_hour_est:     null,
      commit_hour_histogram_est: [],
      hours_without_commits:    0,
      lines_added:              0,
      lines_deleted:            0,
      languages_bytes:          {},
      languages_share:          {},
      repo_size_kb:             0,
      night_owl_score:          0,
      early_bird_score:         0,
      commit_percentile:        0,
      language_percentiles:     {},
      size_percentile:          0,
      activities_participated:  [],
    })
    .select('id')
    .single()

  if (insertErr || !row) {
    console.error(`  ${tag} — failed to insert pending row: ${insertErr?.message}`)
    return
  }

  const shareId = row.id as string

  try {
    const since = HACKATHON_START.toISOString()
    const until = HACKATHON_END.toISOString()

    const [commits, languages, repoMeta] = await Promise.all([
      listCommits(owner, repo, since, until),
      getLanguages(owner, repo),
      getRepoMeta(owner, repo),
    ])

    if (commits.length === 0) {
      await supabase.from('wrapped_stats').update({ status: 'not_found' }).eq('id', shareId)
      console.log(`  ${tag} — no commits in window`)
      return
    }

    const codeFreq = await getCommitLineStats(owner, repo, commits.map(c => c.sha))
    const baseStats = computeStats(commits, codeFreq, languages, repoMeta, HACKATHON_START, HACKATHON_END)
    const percentiles = await computePercentilesFromExisting(shareId, baseStats.totalCommits, baseStats.repoSizeKb, baseStats.languagesShare)

    await supabase
      .from('wrapped_stats')
      .update({
        status:                   'done',
        total_commits:            baseStats.totalCommits,
        first_commit_at:          baseStats.firstCommitAt,
        last_commit_at:           baseStats.lastCommitAt,
        repo_lifespan_hours:      baseStats.repoLifespanHours,
        peak_commit_hour_est:     baseStats.peakCommitHourEst,
        commit_hour_histogram_est: baseStats.commitHourHistogramEst,
        hours_without_commits:    baseStats.hoursWithoutCommits,
        lines_added:              baseStats.linesAdded,
        lines_deleted:            baseStats.linesDeleted,
        languages_bytes:          baseStats.languagesBytes,
        languages_share:          baseStats.languagesShare,
        repo_size_kb:             baseStats.repoSizeKb,
        night_owl_score:          baseStats.nightOwlScore,
        early_bird_score:         baseStats.earlyBirdScore,
        commit_percentile:        percentiles.commitPercentile,
        language_percentiles:     percentiles.languagePercentiles,
        size_percentile:          percentiles.sizePercentile,
        activities_participated:  [],
      })
      .eq('id', shareId)

    console.log(`  ${tag} — done ✓ (${baseStats.totalCommits} commits, +${baseStats.linesAdded}/-${baseStats.linesDeleted} lines)`)
  } catch (e) {
    await supabase.from('wrapped_stats').update({ status: 'error' }).eq('id', shareId)
    console.warn(`  ${tag} — error: ${(e as Error).message}`)
  }
}

async function main() {
  console.log('=== Bulk Wrapped Stats Processor ===\n')

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, repo_url')
    .order('name', { ascending: true })

  if (error || !projects) {
    console.error('Failed to fetch projects:', error?.message)
    process.exit(1)
  }

  console.log(`Processing ${projects.length} projects (hackathon window: Nov 21–23 2025)\n`)

  for (let i = 0; i < projects.length; i++) {
    await processProject(projects[i], i + 1, projects.length)
    // Respect GitHub rate limits (~5000 req/hr authenticated)
    await sleep(200)
  }

  const { count } = await supabase
    .from('wrapped_stats')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'done')

  console.log(`\nAll done. ${count} wrapped_stats rows with status=done.`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })

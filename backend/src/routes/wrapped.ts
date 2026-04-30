import { Hono } from 'hono'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { parseRepoUrl, listCommits, getCommitLineStats, getLanguages, getRepoMeta } from '../services/github'
import { computeStats, computePercentiles } from '../services/analytics'
import { getActivitiesForUser } from '../services/hackathon'

export const wrappedRoute = new Hono()

// Jul 18 2025 10:00 PM ET  →  Jul 20 2025 9:30 AM ET
const HACKATHON_START = new Date('2025-07-18T22:00:00-04:00')
const HACKATHON_END   = new Date('2025-07-20T09:30:00-04:00')

const CreateWrappedSchema = z.object({
  projectId: z.string().uuid(),
  githubUsername: z.string().min(1),
  windowHours: z.number().int().min(1).max(168).optional().default(36),
  allTime: z.boolean().optional().default(false),
  email: z.string().optional(),
})

async function generateWrapped(
  shareId: string,
  owner: string,
  repo: string,
  windowStart: Date,
  windowEnd: Date,
  allTime: boolean,
  githubUsername: string,
  email?: string,
) {
  try {
    const since = allTime ? undefined : windowStart.toISOString()
    const until = allTime ? undefined : windowEnd.toISOString()

    const [commits, languages, repoMeta] = await Promise.all([
      listCommits(owner, repo, since, until, githubUsername),
      getLanguages(owner, repo),
      getRepoMeta(owner, repo),
    ])

    if (commits.length === 0) {
      await supabase.from('wrapped_stats').update({ status: 'not_found' }).eq('id', shareId)
      return
    }

    const codeFreq = await getCommitLineStats(owner, repo, commits.map(c => c.sha))
    const baseStats = computeStats(commits, codeFreq, languages, repoMeta, windowStart, windowEnd)
    const activitiesParticipated = email ? await getActivitiesForUser(email) : []
    const percentiles = await computePercentiles(shareId, baseStats)

    await supabase
      .from('wrapped_stats')
      .update({
        status: 'done',
        total_commits: baseStats.totalCommits,
        first_commit_at: baseStats.firstCommitAt,
        last_commit_at: baseStats.lastCommitAt,
        repo_lifespan_hours: baseStats.repoLifespanHours,
        peak_commit_hour_est: baseStats.peakCommitHourEst,
        commit_hour_histogram_est: baseStats.commitHourHistogramEst,
        hours_without_commits: baseStats.hoursWithoutCommits,
        lines_added: baseStats.linesAdded,
        lines_deleted: baseStats.linesDeleted,
        languages_bytes: baseStats.languagesBytes,
        languages_share: baseStats.languagesShare,
        repo_size_kb: baseStats.repoSizeKb,
        night_owl_score: baseStats.nightOwlScore,
        early_bird_score: baseStats.earlyBirdScore,
        commit_percentile: percentiles.commitPercentile,
        language_percentiles: percentiles.languagePercentiles,
        size_percentile: percentiles.sizePercentile,
        activities_participated: activitiesParticipated,
      })
      .eq('id', shareId)
  } catch {
    await supabase
      .from('wrapped_stats')
      .update({ status: 'error' })
      .eq('id', shareId)
  }
}

wrappedRoute.post('/', async (c) => {
  let body: z.infer<typeof CreateWrappedSchema>
  try {
    body = CreateWrappedSchema.parse(await c.req.json())
  } catch (e) {
    return c.json({ error: 'Invalid request body', details: String(e) }, 400)
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, repo_url')
    .eq('id', body.projectId)
    .single()

  if (projectError || !project) {
    return c.json({ error: 'Project not found' }, 404)
  }

  // Return existing result if already generated for this contributor
  const { data: existing } = await supabase
    .from('wrapped_stats')
    .select('id')
    .eq('project_id', body.projectId)
    .eq('github_username', body.githubUsername)
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    return c.json({ shareId: existing.id })
  }

  const { owner, repo } = parseRepoUrl(project.repo_url)
  const windowStart = body.allTime ? new Date(0) : HACKATHON_START
  const windowEnd   = body.allTime ? new Date()  : HACKATHON_END

  const { data: inserted, error: insertError } = await supabase
    .from('wrapped_stats')
    .insert({
      project_id: project.id,
      display_name: body.githubUsername,
      github_username: body.githubUsername,
      window_start: windowStart.toISOString(),
      window_end: windowEnd.toISOString(),
      status: 'pending',
      total_commits: 0,
      first_commit_at: null,
      peak_commit_hour_est: null,
      commit_hour_histogram_est: [],
      hours_without_commits: 0,
      lines_added: 0,
      lines_deleted: 0,
      languages_bytes: {},
      languages_share: {},
      repo_size_kb: 0,
      night_owl_score: 0,
      early_bird_score: 0,
      commit_percentile: 0,
      language_percentiles: {},
      size_percentile: 0,
      activities_participated: [],
    })
    .select('id')
    .single()

  if (insertError || !inserted) {
    return c.json({ error: 'Failed to create wrapped job', details: insertError?.message }, 500)
  }

  const shareId = inserted.id as string

  // Fire and forget — response returns immediately
  generateWrapped(shareId, owner, repo, windowStart, windowEnd, body.allTime, body.githubUsername, body.email).catch(() => {})

  return c.json({ shareId })
})

wrappedRoute.get('/:shareId', async (c) => {
  const shareId = c.req.param('shareId')

  const { data, error } = await supabase
    .from('wrapped_stats')
    .select(`
      id,
      status,
      github_username,
      total_commits,
      first_commit_at,
      last_commit_at,
      repo_lifespan_hours,
      peak_commit_hour_est,
      commit_hour_histogram_est,
      hours_without_commits,
      lines_added,
      lines_deleted,
      languages_bytes,
      languages_share,
      repo_size_kb,
      night_owl_score,
      early_bird_score,
      commit_percentile,
      language_percentiles,
      size_percentile,
      activities_participated,
      projects (
        id,
        name,
        repo_url
      )
    `)
    .eq('id', shareId)
    .single()

  if (error || !data) {
    return c.json({ error: 'Not found' }, 404)
  }

  if (data.status === 'pending') {
    return c.json({ status: 'pending' })
  }

  if (data.status === 'not_found') {
    return c.json({ status: 'not_found' }, 404)
  }

  if (data.status === 'error') {
    return c.json({ error: 'Generation failed' }, 500)
  }

  const projectRaw = data.projects as unknown
  const project = (Array.isArray(projectRaw) ? projectRaw[0] : projectRaw) as { id: string; name: string; repo_url: string } | null
  if (!project) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json({
    status: 'done',
    shareId: data.id,
    displayName: data.github_username,
    project: {
      id: project.id,
      name: project.name,
      repoUrl: project.repo_url,
    },
    stats: {
      totalCommits: data.total_commits,
      firstCommitAt: data.first_commit_at,
      lastCommitAt: data.last_commit_at,
      repoLifespanHours: data.repo_lifespan_hours ?? 0,
      peakCommitHourEst: data.peak_commit_hour_est,
      commitHourHistogramEst: data.commit_hour_histogram_est,
      hoursWithoutCommits: data.hours_without_commits,
      linesAdded: data.lines_added,
      linesDeleted: data.lines_deleted,
      languagesBytes: data.languages_bytes,
      languagesShare: data.languages_share,
      repoSizeKb: data.repo_size_kb,
      nightOwlScore: data.night_owl_score,
      earlyBirdScore: data.early_bird_score,
      commitPercentile: data.commit_percentile,
      languagePercentiles: data.language_percentiles,
      sizePercentile: data.size_percentile,
      activitiesParticipated: Array.isArray(data.activities_participated)
        ? (data.activities_participated as string[])
        : [],
    },
  })
})

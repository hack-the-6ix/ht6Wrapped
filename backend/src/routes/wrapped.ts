import { Hono } from 'hono'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { parseRepoUrl, listCommits, getCodeFrequency, getLanguages, getRepoMeta } from '../services/github'
import { scrapeSubmission } from '../services/devpost'
import { computeStats, computePercentiles } from '../services/analytics'

export const wrappedRoute = new Hono()

const CreateWrappedSchema = z.object({
  projectId: z.string().uuid(),
  displayName: z.string().min(1),
  windowHours: z.number().int().min(1).max(168).optional().default(36),
  devpostUrl: z.string().url().optional(),
})

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

  const { owner, repo } = parseRepoUrl(project.repo_url)
  const windowEnd = new Date()
  const windowStart = new Date(windowEnd.getTime() - body.windowHours * 3_600_000)

  const [commits, codeFreq, languages, repoMeta] = await Promise.all([
    listCommits(owner, repo, windowStart.toISOString(), windowEnd.toISOString()),
    getCodeFrequency(owner, repo),
    getLanguages(owner, repo),
    getRepoMeta(owner, repo),
  ])

  const baseStats = computeStats(commits, codeFreq, languages, repoMeta, windowStart, windowEnd)
  const activitiesParticipated: string[] = []

  const { data: inserted, error: insertError } = await supabase
    .from('wrapped_stats')
    .insert({
      project_id: project.id,
      display_name: body.displayName,
      window_start: windowStart.toISOString(),
      window_end: windowEnd.toISOString(),
      total_commits: baseStats.totalCommits,
      first_commit_at: baseStats.firstCommitAt,
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
      commit_percentile: 0,
      language_percentiles: {},
      size_percentile: 0,
      activities_participated: activitiesParticipated,
    })
    .select('id')
    .single()

  if (insertError || !inserted) {
    return c.json({ error: 'Failed to save wrapped stats', details: insertError?.message }, 500)
  }

  const shareId = inserted.id as string

  const percentiles = await computePercentiles(shareId, baseStats)

  await supabase
    .from('wrapped_stats')
    .update({
      commit_percentile: percentiles.commitPercentile,
      size_percentile: percentiles.sizePercentile,
      language_percentiles: percentiles.languagePercentiles,
    })
    .eq('id', shareId)

  const stats = { ...baseStats, ...percentiles, activitiesParticipated }

  return c.json({ shareId, stats })
})

wrappedRoute.get('/:shareId', async (c) => {
  const shareId = c.req.param('shareId')

  const { data, error } = await supabase
    .from('wrapped_stats')
    .select(`
      id,
      display_name,
      total_commits,
      first_commit_at,
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

  const projectRaw = data.projects as unknown
  const project = (Array.isArray(projectRaw) ? projectRaw[0] : projectRaw) as { id: string; name: string; repo_url: string } | null
  if (!project) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json({
    shareId: data.id,
    displayName: data.display_name,
    project: {
      id: project.id,
      name: project.name,
      repoUrl: project.repo_url,
    },
    stats: {
      totalCommits: data.total_commits,
      firstCommitAt: data.first_commit_at,
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

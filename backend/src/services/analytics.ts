import { toZonedTime } from 'date-fns-tz'
import type { CommitListItem } from '../services/github'
import type { CodeFrequencyResult, RepoMeta, WrappedStats } from '../types'
import { supabase } from '../lib/supabase'

const TORONTO_TZ = 'America/Toronto'

export function computeStats(
  commits: CommitListItem[],
  codeFreq: CodeFrequencyResult,
  languages: Record<string, number>,
  repoMeta: RepoMeta,
  windowStart: Date,
  windowEnd: Date,
): Omit<WrappedStats, 'commitPercentile' | 'languagePercentiles' | 'sizePercentile'> {
  const totalCommits = commits.length

  let firstCommitAt: string | null = null
  if (totalCommits > 0) {
    firstCommitAt = commits.reduce((earliest, c) =>
      c.authorDate < earliest ? c.authorDate : earliest,
      commits[0].authorDate,
    )
  }

  const histogram = new Array<number>(24).fill(0)
  for (const commit of commits) {
    const zonedDate = toZonedTime(new Date(commit.authorDate), TORONTO_TZ)
    histogram[zonedDate.getHours()]++
  }

  const peakCommitHourEst = totalCommits > 0
    ? histogram.indexOf(Math.max(...histogram))
    : null

  // Count hour-slots in window with zero commits
  let hoursWithoutCommits = 0
  const windowStartZoned = toZonedTime(windowStart, TORONTO_TZ)
  const windowEndZoned = toZonedTime(windowEnd, TORONTO_TZ)
  const cursor = new Date(windowStartZoned)
  cursor.setMinutes(0, 0, 0)
  while (cursor <= windowEndZoned) {
    if (histogram[cursor.getHours()] === 0) hoursWithoutCommits++
    cursor.setHours(cursor.getHours() + 1)
  }

  const totalBytes = Object.values(languages).reduce((s, b) => s + b, 0)
  const languagesBytes = languages
  const languagesShare: Record<string, number> = {}
  if (totalBytes > 0) {
    for (const [lang, bytes] of Object.entries(languages)) {
      languagesShare[lang] = bytes / totalBytes
    }
  }

  let nightOwlScore = 0
  let earlyBirdScore = 0
  if (totalCommits > 0) {
    let nightOwl = 0
    let earlyBird = 0
    for (const commit of commits) {
      const hour = toZonedTime(new Date(commit.authorDate), TORONTO_TZ).getHours()
      if (hour >= 0 && hour <= 5) nightOwl++
      if (hour >= 6 && hour <= 9) earlyBird++
    }
    nightOwlScore = nightOwl / totalCommits
    earlyBirdScore = earlyBird / totalCommits
  }

  return {
    totalCommits,
    firstCommitAt,
    peakCommitHourEst,
    commitHourHistogramEst: histogram,
    hoursWithoutCommits,
    linesAdded: codeFreq.additions,
    linesDeleted: codeFreq.deletions,
    languagesBytes,
    languagesShare,
    repoSizeKb: repoMeta.sizeKb,
    nightOwlScore,
    earlyBirdScore,
  }
}

export async function computePercentiles(
  shareId: string,
  stats: Pick<WrappedStats, 'totalCommits' | 'repoSizeKb' | 'languagesShare'>,
): Promise<{ commitPercentile: number; sizePercentile: number; languagePercentiles: Record<string, number> }> {
  const { data: allRows, error } = await supabase
    .from('wrapped_stats')
    .select('total_commits, repo_size_kb, languages_share')

  if (error || !allRows || allRows.length === 0) {
    return { commitPercentile: 0, sizePercentile: 0, languagePercentiles: {} }
  }

  const total = allRows.length

  const commitPercentile =
    allRows.filter((r) => (r.total_commits ?? 0) < stats.totalCommits).length / total

  const sizePercentile =
    allRows.filter((r) => (r.repo_size_kb ?? 0) < stats.repoSizeKb).length / total

  const languagePercentiles: Record<string, number> = {}
  for (const [lang, share] of Object.entries(stats.languagesShare)) {
    const below = allRows.filter((r) => {
      const rowShare = (r.languages_share as Record<string, number> | null)?.[lang] ?? 0
      return rowShare < share
    }).length
    languagePercentiles[lang] = below / total
  }

  return { commitPercentile, sizePercentile, languagePercentiles }
}

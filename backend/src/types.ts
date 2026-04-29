export interface Project {
  id: string
  name: string
  repoUrl: string
}

export interface CodeFrequencyResult {
  additions: number
  deletions: number
}

export interface RepoMeta {
  sizeKb: number
}

export interface WrappedStats {
  totalCommits: number
  firstCommitAt: string | null
  lastCommitAt: string | null
  repoLifespanHours: number
  peakCommitHourEst: number | null
  commitHourHistogramEst: number[]
  hoursWithoutCommits: number
  linesAdded: number
  linesDeleted: number
  languagesBytes: Record<string, number>
  languagesShare: Record<string, number>
  repoSizeKb: number
  nightOwlScore: number
  earlyBirdScore: number
  commitPercentile: number
  languagePercentiles: Record<string, number>
  sizePercentile: number
  activitiesParticipated: string[]
}

export interface WrappedResult {
  shareId: string
  displayName: string
  project: Project
  stats: WrappedStats
}

export interface CreateWrappedRequest {
  projectId: string
  displayName: string
  windowHours?: number
  devpostUrl?: string
}

export interface DevpostSubmission {
  url: string
  projectName: string
  tagline?: string
  description?: string
  teamMembers: { name: string; username?: string; profileUrl?: string }[]
  technologies: string[]
  builtAt?: string
}

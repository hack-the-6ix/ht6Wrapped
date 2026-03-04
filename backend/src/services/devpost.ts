export interface DevpostSubmission {
  url: string
  projectName: string
  tagline?: string
  description?: string
  teamMembers: { name: string; username?: string; profileUrl?: string }[]
  technologies: string[]
  builtAt?: string
}

const DEVPOST_ORIGIN = 'https://devpost.com'
const SOFTWARE_PATH_PREFIX = '/software/'

export function validateAndNormalizeDevpostUrl(input: string): string {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new Error('Invalid Devpost URL')
  }

  if (url.origin !== DEVPOST_ORIGIN) {
    throw new Error('Invalid Devpost URL: must be from devpost.com')
  }

  const path = url.pathname.replace(/\/+$/, '') 
  if (!path.startsWith(SOFTWARE_PATH_PREFIX) || path === SOFTWARE_PATH_PREFIX) {
    throw new Error('Invalid Devpost URL: path must be /software/...')
  }

  return `${DEVPOST_ORIGIN}${path}`
}

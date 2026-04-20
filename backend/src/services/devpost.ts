import * as cheerio from 'cheerio'
import type { DevpostSubmission } from '../types'

export type { DevpostSubmission }

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

export async function scrapeSubmission(devpostUrl: string): Promise<DevpostSubmission> {
  const normalizedUrl = validateAndNormalizeDevpostUrl(devpostUrl)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  let html: string
  try {
    const res = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'HackThe6ixWrapped/1.0',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) {
      throw new Error(`Submission not found (HTTP ${res.status})`)
    }
    html = await res.text()
  } finally {
    clearTimeout(timeout)
  }

  const $ = cheerio.load(html)

  const projectName = $('h1').first().text().trim() || 'Unknown'

  const tagline = $('h1').first().next('p').text().trim() || undefined

  // Description: paragraphs inside #app-details-left, excluding the gallery section
  const descParts: string[] = []
  $('#app-details-left p').each((_, el) => {
    if ($(el).closest('#gallery').length > 0) return
    const text = $(el).text().trim()
    if (text) descParts.push(text)
  })
  const description = descParts.join('\n').slice(0, 2000) || undefined

  // Team members: li.software-team-member → name link in the text column (not the image column)
  const teamMembers: DevpostSubmission['teamMembers'] = []
  $('li.software-team-member').each((_, li) => {
    const nameLink = $(li).find('.small-10 a.user-profile-link, .large-8 a.user-profile-link').first()
    const name = nameLink.text().trim()
    const href = nameLink.attr('href') ?? ''
    if (!name) return
    const profileUrl = href.startsWith('http') ? href : `${DEVPOST_ORIGIN}${href}`
    const username = profileUrl.replace(DEVPOST_ORIGIN + '/', '').split('/')[0]
    teamMembers.push({ name, username, profileUrl })
  })

  // Technologies: "Built With" h2 → following ul li text
  const technologies: string[] = []
  $('h2').each((_, heading) => {
    if ($(heading).text().toLowerCase().includes('built with')) {
      $(heading).nextAll().each((_, sibling) => {
        if (sibling.type === 'tag' && (sibling as cheerio.Element).name === 'h2') return false
        if (sibling.type === 'tag' && (sibling as cheerio.Element).name === 'ul') {
          $(sibling).find('li').each((_, li) => {
            const tech = $(li).text().trim()
            if (tech) technologies.push(tech)
          })
        }
      })
    }
  })

  // Built at: hackathon link in .software-list-content
  const builtAt = $('.software-list-content a[href*=".devpost.com"]').first().text().trim() || undefined

  return {
    url: normalizedUrl,
    projectName,
    tagline,
    description,
    teamMembers,
    technologies,
    builtAt,
  }
}

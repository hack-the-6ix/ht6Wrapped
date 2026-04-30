/**
 * Scrapes all HackThe6ix 2025 Devpost submissions, extracts GitHub repo URLs,
 * and inserts them into the Supabase projects table.
 *
 * Run with: bun run src/scripts/seed-projects.ts
 */

import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const HACKATHON_GALLERY = 'https://hackthe6ix2025.devpost.com/project-gallery'
const TOTAL_PAGES = 6
const CONCURRENCY = 5
const DELAY_MS = 300

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HackThe6ixWrapped/1.0)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

async function getAllSubmissionUrls(): Promise<string[]> {
  const urls: string[] = []
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`Fetching gallery page ${page}/${TOTAL_PAGES}...`)
    const html = await fetchHtml(`${HACKATHON_GALLERY}?page=${page}&per_page=24`)
    const $ = cheerio.load(html)
    $('a[href*="devpost.com/software/"]').each((_, el) => {
      const href = $(el).attr('href') ?? ''
      const match = href.match(/https?:\/\/devpost\.com\/software\/[^"?#]+/)
      if (match) urls.push(match[0])
    })
    // Also catch relative URLs
    $('a[href^="/software/"]').each((_, el) => {
      const href = $(el).attr('href') ?? ''
      urls.push(`https://devpost.com${href.split('?')[0].replace(/\/+$/, '')}`)
    })
    await sleep(DELAY_MS)
  }
  return [...new Set(urls)]
}

interface ProjectEntry {
  name: string
  devpost_url: string
  repo_url: string
}

async function scrapeGithubUrls(devpostUrl: string): Promise<ProjectEntry[]> {
  let html: string
  try {
    html = await fetchHtml(devpostUrl)
  } catch (e) {
    console.warn(`  Skipping ${devpostUrl}: ${(e as Error).message}`)
    return []
  }

  const $ = cheerio.load(html)
  const projectName = $('h1').first().text().trim() || 'Unknown'

  const githubUrls = new Set<string>()
  $('a[href*="github.com/"]').each((_, el) => {
    const href = $(el).attr('href') ?? ''
    // Normalize: strip trailing slashes, query params, fragments
    const match = href.match(/https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/)
    if (match) githubUrls.add(match[0].replace(/\/+$/, ''))
  })

  return [...githubUrls].map(repoUrl => ({ name: projectName, devpost_url: devpostUrl, repo_url: repoUrl }))
}

async function runConcurrent<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency: number,
): Promise<void> {
  const queue = [...items]
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()!
      await fn(item)
      await sleep(DELAY_MS)
    }
  })
  await Promise.all(workers)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('=== HackThe6ix 2025 Devpost Scraper ===\n')

  console.log('Step 1: Collecting all submission URLs...')
  const submissionUrls = await getAllSubmissionUrls()
  console.log(`Found ${submissionUrls.length} submissions.\n`)

  console.log('Step 2: Scraping GitHub URLs from each submission...')
  const allProjects: ProjectEntry[] = []
  let done = 0

  await runConcurrent(submissionUrls, async (url) => {
    const entries = await scrapeGithubUrls(url)
    allProjects.push(...entries)
    done++
    if (entries.length > 0) {
      console.log(`  [${done}/${submissionUrls.length}] ${entries[0].name} → ${entries.map(e => e.repo_url).join(', ')}`)
    } else {
      console.log(`  [${done}/${submissionUrls.length}] (no GitHub URL) ${url}`)
    }
  }, CONCURRENCY)

  const withRepos = allProjects.filter(p => p.repo_url)
  console.log(`\nFound ${withRepos.length} GitHub repos across ${submissionUrls.length} submissions.\n`)

  if (withRepos.length === 0) {
    console.log('Nothing to insert.')
    return
  }

  console.log('Step 3: Inserting into Supabase projects table...')
  // Insert in batches of 50, using upsert on repo_url to avoid duplicates
  const BATCH = 50
  let inserted = 0
  for (let i = 0; i < withRepos.length; i += BATCH) {
    const batch = withRepos.slice(i, i + BATCH).map(p => ({
      name: p.name,
      repo_url: p.repo_url,
    }))
    const { error } = await supabase
      .from('projects')
      .upsert(batch, { onConflict: 'repo_url', ignoreDuplicates: true })
    if (error) {
      console.error(`  Batch ${i / BATCH + 1} error:`, error.message)
    } else {
      inserted += batch.length
      console.log(`  Inserted batch ${i / BATCH + 1} (${inserted}/${withRepos.length})`)
    }
  }

  console.log(`\nDone. ${inserted} rows upserted into projects.`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})

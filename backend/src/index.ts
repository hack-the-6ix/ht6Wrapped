import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './lib/env'
import { projectsRoute } from './routes/projects'
import { wrappedRoute } from './routes/wrapped'
import { scrapeSubmission, validateAndNormalizeDevpostUrl } from './services/devpost'

const app = new Hono()

app.use('*', cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }))

app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error', message: String(err) }, 500)
})

app.get('/', (c) => c.text('api running'))
app.get('/ping', (c) => c.json({ ok: true }))

app.route('/projects', projectsRoute)
app.route('/wrapped', wrappedRoute)

app.get('/devpost', async (c) => {
  const url = c.req.query('url')
  if (!url) return c.json({ error: 'Missing url query param' }, 400)
  try {
    const submission = await scrapeSubmission(url)
    return c.json(submission)
  } catch (e) {
    return c.json({ error: String(e) }, 400)
  }
})

export default {
  port: env.PORT,
  fetch: app.fetch,
  idleTimeout: 120,
}

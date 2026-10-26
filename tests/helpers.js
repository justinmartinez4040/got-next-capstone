import { expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Direct database access for setup, cleanup, and checking rows.
// Uses the same public anon key as the app, read from .env (never printed).
export const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

// Fixed ids from supabase/test-seed.sql
export const SEED = {
  A: '00000000-0000-4000-8000-00000000000a',
  B: '00000000-0000-4000-8000-00000000000b',
  C: '00000000-0000-4000-8000-00000000000c',
  EDIT_ME: '00000000-0000-4000-8000-0000000000ed',
  DELETE_ME: '00000000-0000-4000-8000-0000000000de',
}

// Same output as src/lib/format.js under the tests' fixed timezone and locale.
export function expectedTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export async function countCheckIns(eventId) {
  const { count, error } = await db
    .from('check_ins')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
  if (error) throw error
  return count
}

// Collects page crashes and console errors so a test can assert there were none.
export function watchForErrors(page) {
  const errors = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`) })
  return errors
}

export function uniqueName(label) {
  return `Test ${label} ${Date.now()}`
}

// Creates an event through the real form and returns its id from the URL.
export async function createEventViaUI(page, { name, place = 'Archbold Gym', startsAt = '2026-11-14T19:30' }) {
  await page.goto('/new')
  await page.getByLabel('Name').fill(name)
  await page.getByLabel('Place').fill(place)
  await page.getByLabel('Date & time').fill(startsAt)
  await page.getByRole('button', { name: 'Create event' }).click()
  await expect(page).toHaveURL(/\/e\/[0-9a-f-]{36}$/)
  return page.url().split('/e/')[1]
}

export async function deleteEvents(ids) {
  if (ids.length === 0) return
  const { error } = await db.from('events').delete().in('id', ids)
  if (error) throw error
}

import { expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Direct database access for setup, cleanup, and checking rows.
// Uses the same public anon key as the app, read from .env (never printed).
export const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

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

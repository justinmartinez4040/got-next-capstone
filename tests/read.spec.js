import { test, expect } from '@playwright/test'
import { db, SEED, countCheckIns, expectedTime, watchForErrors, uniqueName } from './helpers.js'

test('Check 4: the event page shows the right name, place, time, and crowd count', async ({ page }) => {
  const { data: row, error } = await db.from('events').select('*').eq('id', SEED.A).single()
  expect(error, 'Seed A missing: run supabase/test-seed.sql').toBeNull()
  const counted = await countCheckIns(SEED.A)
  expect(counted).toBe(5)

  await page.goto(`/e/${SEED.A}`)
  await expect(page.getByTestId('event-name')).toHaveText(row.name)
  await expect(page.getByTestId('event-place')).toHaveText(row.place)
  await expect(page.getByTestId('event-time')).toHaveText(expectedTime(row.starts_at))
  await expect(page.getByTestId('crowd-count')).toHaveText(String(counted))
})

test('Check 5: browse lists events by crowd size (9, 5, 2)', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('event-row').first()).toBeVisible()

  const rows = await page.getByTestId('event-row').evaluateAll((els) =>
    els.map((el) => ({
      id: el.dataset.eventId,
      count: el.querySelector('[data-testid="row-count"]').textContent,
    })),
  )
  const seedIds = [SEED.C, SEED.A, SEED.B]
  const seedRows = rows.filter((r) => seedIds.includes(r.id))

  expect(seedRows.map((r) => r.id)).toEqual(seedIds)
  expect(seedRows.map((r) => r.count)).toEqual(['9', '5', '2'])
})

test.describe('Check 6: missing or deleted event shows "Event not found" without crashing', () => {
  async function expectNotFound(page, path) {
    const errors = watchForErrors(page)
    await page.goto(path)
    await expect(page.getByRole('heading', { name: 'Event not found' })).toBeVisible()
    expect(errors).toEqual([])
  }

  test('random id that never existed', async ({ page }) => {
    await expectNotFound(page, `/e/${crypto.randomUUID()}`)
  })

  test('garbage id', async ({ page }) => {
    await expectNotFound(page, '/e/not-a-real-id')
  })

  test('event that was deleted', async ({ page }) => {
    const { data, error } = await db
      .from('events')
      .insert({ name: uniqueName('Read-6'), place: 'Nowhere', starts_at: new Date().toISOString() })
      .select('id')
      .single()
    expect(error).toBeNull()
    await db.from('events').delete().eq('id', data.id)

    await expectNotFound(page, `/e/${data.id}`)
  })
})

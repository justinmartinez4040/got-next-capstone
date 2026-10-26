import { test, expect } from '@playwright/test'
import { db, SEED, countCheckIns, expectedTime } from './helpers.js'

const ID = SEED.EDIT_ME
let original

test.beforeAll(async () => {
  const { data, error } = await db.from('events').select('name, place, starts_at').eq('id', ID).single()
  expect(error, 'Seed Edit Me missing: run supabase/test-seed.sql').toBeNull()
  original = data
})

// Put Seed Edit Me back so the tests can be re-run without re-seeding.
test.afterAll(async () => {
  await db.from('events').update(original).eq('id', ID)
})

async function editViaUI(page, fields) {
  await page.goto(`/e/${ID}`)
  await page.getByRole('link', { name: 'Edit', exact: true }).click()
  await expect(page).toHaveURL(`/e/${ID}/edit`)
  await expect(page.getByLabel('Name')).toHaveValue(/.+/) // form is prefilled
  if (fields.name !== undefined) await page.getByLabel('Name').fill(fields.name)
  if (fields.place !== undefined) await page.getByLabel('Place').fill(fields.place)
  if (fields.startsAt !== undefined) await page.getByLabel('Date & time').fill(fields.startsAt)
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page).toHaveURL(`/e/${ID}`)
}

function listRow(page) {
  return page.locator(`[data-testid="event-row"][data-event-id="${ID}"]`)
}

async function checkInRows() {
  const { data, error } = await db.from('check_ins').select('id, created_at').eq('event_id', ID).order('id')
  if (error) throw error
  return data
}

test('Check 7: an edited name shows in both the list and the link page', async ({ page }) => {
  const newName = `Edited Name ${Date.now()}`
  await editViaUI(page, { name: newName })

  await expect(page.getByTestId('event-name')).toHaveText(newName)
  await page.goto('/')
  await expect(listRow(page).getByTestId('row-name')).toHaveText(newName)
})

test('Check 8a: an edited place shows in both the list and the link page', async ({ page }) => {
  const newPlace = `Edited Place ${Date.now()}`
  await editViaUI(page, { place: newPlace })

  await expect(page.getByTestId('event-place')).toHaveText(newPlace)
  await page.goto('/')
  await expect(listRow(page).getByTestId('row-place')).toHaveText(newPlace)
})

test('Check 8b: an edited time shows in both the list and the link page', async ({ page }) => {
  // 9:15 PM New York time on Dec 5, 2026 (EST, UTC-5)
  await editViaUI(page, { startsAt: '2026-12-05T21:15' })

  const { data } = await db.from('events').select('starts_at').eq('id', ID).single()
  expect(new Date(data.starts_at).toISOString()).toBe('2026-12-06T02:15:00.000Z')

  const shown = expectedTime(data.starts_at)
  await expect(page.getByTestId('event-time')).toHaveText(shown)
  await page.goto('/')
  await expect(listRow(page).getByTestId('row-time')).toHaveText(shown)
})

test('Check 9: the crowd count is the same after an edit', async ({ page }) => {
  await page.goto(`/e/${ID}`)
  await expect(page.getByTestId('crowd-count')).toHaveText('3')
  expect(await countCheckIns(ID)).toBe(3)

  await editViaUI(page, { name: `Count Check ${Date.now()}` })

  await expect(page.getByTestId('crowd-count')).toHaveText('3')
  expect(await countCheckIns(ID)).toBe(3)
  await page.goto('/')
  await expect(listRow(page).getByTestId('row-count')).toHaveText('3')
})

test('Check 10: people who already checked in are still checked in after an edit', async ({ page }) => {
  const before = await checkInRows()
  expect(before).toHaveLength(3)

  await editViaUI(page, { name: `Keep Check-ins ${Date.now()}`, place: 'Somewhere Else', startsAt: '2026-12-24T10:00' })

  const after = await checkInRows()
  expect(after).toEqual(before) // same row ids and same check-in times
})

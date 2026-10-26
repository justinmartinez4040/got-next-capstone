import { test, expect } from '@playwright/test'
import { db, SEED, countCheckIns, watchForErrors } from './helpers.js'

const ID = SEED.DELETE_ME

function listRow(page) {
  return page.locator(`[data-testid="event-row"][data-event-id="${ID}"]`)
}

async function eventExists() {
  const { data, error } = await db.from('events').select('id').eq('id', ID).maybeSingle()
  if (error) throw error
  return data !== null
}

async function clickDelete(page, { accept }) {
  await page.goto(`/e/${ID}/edit`)
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Seed Delete Me')
    expect(dialog.message()).toContain('4 check-ins')
    accept ? await dialog.accept() : await dialog.dismiss()
  })
  await page.getByRole('button', { name: 'Delete event' }).click()
}

test.describe.serial('Delete', () => {
  test('Setup: Seed Delete Me exists with 4 visible check-ins', async () => {
    expect(await eventExists(), 'Seed Delete Me missing: re-run supabase/test-seed.sql').toBe(true)
    // Proves the app's key can see these rows, so a later 0 means deleted, not hidden.
    expect(await countCheckIns(ID)).toBe(4)
  })

  test('Cancelling the confirm deletes nothing', async ({ page }) => {
    await clickDelete(page, { accept: false })
    await expect(page).toHaveURL(`/e/${ID}/edit`)
    expect(await eventExists()).toBe(true)
    expect(await countCheckIns(ID)).toBe(4)
  })

  test('Check 11: after deleting, the event is gone from the list', async ({ page }) => {
    await clickDelete(page, { accept: true })
    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('event-list')).toBeVisible()
    await expect(listRow(page)).toHaveCount(0)
    expect(await eventExists()).toBe(false)
  })

  test('Check 12: the event link shows "Event not found"', async ({ page }) => {
    const errors = watchForErrors(page)
    await page.goto(`/e/${ID}`)
    await expect(page.getByRole('heading', { name: 'Event not found' })).toBeVisible()
    await page.goto(`/e/${ID}/edit`)
    await expect(page.getByRole('heading', { name: 'Event not found' })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('Check 13: zero check_ins rows remain for the deleted event', async () => {
    expect(await countCheckIns(ID)).toBe(0)
  })
})

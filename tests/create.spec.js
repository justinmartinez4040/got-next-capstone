import { test, expect } from '@playwright/test'
import { createEventViaUI, deleteEvents, uniqueName } from './helpers.js'

const createdIds = []

test.afterAll(async () => {
  await deleteEvents(createdIds)
})

test('Check 1: a created event shows up in the list', async ({ page }) => {
  const name = uniqueName('Create-1')
  const id = await createEventViaUI(page, { name })
  createdIds.push(id)

  await page.goto('/')
  const row = page.locator(`[data-testid="event-row"][data-event-id="${id}"]`)
  await expect(row).toBeVisible()
  await expect(row.getByTestId('row-name')).toHaveText(name)
})

test('Check 2: the shareable link opens that exact event', async ({ page, context }) => {
  const name = uniqueName('Create-2')
  const id = await createEventViaUI(page, { name })
  createdIds.push(id)

  const shareUrl = await page.getByTestId('share-link').inputValue()
  expect(shareUrl).toBe(`http://localhost:5173/e/${id}`)

  // Open the link in a brand-new tab, like someone who was sent it.
  const fresh = await context.newPage()
  await fresh.goto(shareUrl)
  await expect(fresh.getByTestId('event-name')).toHaveText(name)
  expect(fresh.url()).toBe(shareUrl)
})

test('Check 3: a new event starts with a crowd count of 0', async ({ page }) => {
  const name = uniqueName('Create-3')
  const id = await createEventViaUI(page, { name })
  createdIds.push(id)

  await expect(page.getByTestId('crowd-count')).toHaveText('0')

  await page.goto('/')
  const row = page.locator(`[data-testid="event-row"][data-event-id="${id}"]`)
  await expect(row.getByTestId('row-count')).toHaveText('0')
})

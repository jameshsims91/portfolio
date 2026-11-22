import { test, expect } from '@playwright/test'

test('portfolio homepage loads successfully', async ({ page }) => {
  // Mock the Projects API so Rails doesn't need to be running.
  await page.route('**/api/projects', async (route) => {
    await route.fulfill({
      staus: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })

  // Load the local portfolio through Vite.
  await page.goto('/')

  // Verify the main content is visible.
  await expect(page.locator('main')).toBeVisible()

  // Verify all five portfolio sections exist.
  for (const sectionId of [
    'home',
    'about',
    'skills',
    'projects',
    'contact',
  ]) {
    await expect(
      page.locator(`section#${sectionId}`)
    ).toHaveCount(1)
  }

  // Verify the footer exists.
  await expect(page.locator('footer')).toHaveCount(1)
})

import { test, expect } from '@playwright/test'

test('navbar links navigate to their matching sections', async ({ page }) => {
  // Avoid depending on the Rails API.
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  await page.goto('/')

  const navigation = page.getByRole('navigation')

  const links = navigation.locator('a[href^="#"]:visible')

  const count = await links.count()

  expect(count).toBeGreaterThan(0)

  for (let i = 0; i < count; i++) {
    const link = links.nth(i)
    const href = await link.getAttribute('href')

    const targetId = href.slice(1)

    expect(targetId).not.toBe('')

    const target = page.locator(`[id="${targetId}"]`)

    await expect(target).toHaveCount(1)

    await link.click()

    await expect(page).toHaveURL(
      new RegExp(`#${targetId}$`)
    )
  }
})

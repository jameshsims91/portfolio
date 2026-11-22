
import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'small mobile', width: 375, height: 667 },
  { name: 'large mobile', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 },
]

for (const viewport of viewports) {
  test(`portfolio fits ${viewport.name} viewport`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })

    // Keep the test independent of the Rails API.
    await page.route('**/api/projects', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    )

    await page.goto('/')

    await expect(page.locator('main')).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }))

    expect(
      dimensions.documentWidth,
      `Horizontal overflow detected at ${viewport.width}px`
    ).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
  })
}

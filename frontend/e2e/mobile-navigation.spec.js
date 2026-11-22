
import { test, expect, devices } from '@playwright/test'

test.use({
  ...devices['iPhone 13'],
  defaultBrowserType: 'chromium',
})

test('mobile navigation opens and closes after selecting a section', async ({ page }) => {
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  await page.goto('/')

  const toggle = page.locator('.navbar-toggler')

  await expect(toggle).toBeVisible()

  // Open the mobile menu.
  await toggle.click()

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  const navigation = page.getByRole('navigation')

  const aboutLink = navigation.getByRole('link', { name: 'About' })

  await expect(aboutLink).toBeVisible()

  // Navigate to the About section.
  await aboutLink.click()

  await expect(page).toHaveURL(/#about$/)

  // The menu should close after navigation.
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

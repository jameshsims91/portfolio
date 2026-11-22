
import { test, expect } from '@playwright/test'

test('production portfolio loads real projects from Rails', async ({ page }) => {
  await page.goto('https://jameshsims.tech/')

  await expect(
    page.getByRole('heading', {
      name: 'Full-Stack Messaging App',
    })
  ).toBeVisible()

  await expect(
    page.getByText('Unable to load projects. Please try again.')
  ).toHaveCount(0)
})

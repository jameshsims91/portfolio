
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage has no automatically detectable accessibility violations', async ({ page }) => {
  // Keep the test independent of the Rails API.
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  await page.goto('/')

  // Wait until the Projects API loading state finishes.
  await expect(
    page.getByText('No featured projects are available yet.')
  ).toBeVisible()

  // Audit the fully rendered homepage.
  const accessibilityScan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  // Report violations if the audit fails.
  expect(accessibilityScan.violations).toEqual([])
})


test('open mobile navigation has no detectable accessibility violations', async ({ page }) => {
  // Use a mobile-sized viewport.
  await page.setViewportSize({
    width: 375,
    height: 812,
  })

  // Mock the Projects API.
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  await page.goto('/')

  await expect(
    page.getByText('No featured projects are available yet.')
  ).toBeVisible()

  const toggle = page.locator('.navbar-toggler')

  await expect(toggle).toBeVisible()

  // Open the mobile navigation menu.
  await toggle.click()

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  // Audit the page while the menu is open.
  const accessibilityScan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  expect(accessibilityScan.violations).toEqual([])
})


test('mobile navigation can be operated using the keyboard', async ({ page }) => {
  await page.setViewportSize({
    width: 375,
    height: 812,
  })

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

  // Focus the menu button using keyboard navigation.
  await page.keyboard.press('Tab')

  // Verify focus can reach the toggle.
  // Navigate with Tab until the toggle receives focus.
  for (let i = 0; i < 10; i++) {
    if (await toggle.evaluate((element) => element === document.activeElement)) {
      break
    }

    await page.keyboard.press('Tab')
  }

  await expect(toggle).toBeFocused()

  // Open the menu using Enter.
  await page.keyboard.press('Enter')

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  const aboutLink = page.getByRole('navigation').getByRole('link', {
    name: 'About',
  })

  await expect(aboutLink).toBeVisible()

  // Navigate to the About link using Tab.
  for (let i = 0; i < 10; i++) {
    if (await aboutLink.evaluate((element) => element === document.activeElement)) {
      break
    }

    await page.keyboard.press('Tab')
  }

  await expect(aboutLink).toBeFocused()

  // Activate the link using Enter.
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(/#about$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})


test('contact form fields are accessible using the keyboard', async ({ page }) => {
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  await page.goto('/')

  const contact = page.locator('#contact')

  const nameField = contact.getByRole('textbox', {
    name: 'Name',
  })

  const emailField = contact.getByRole('textbox', {
    name: 'Email',
  })

  const messageField = contact.getByRole('textbox', {
    name: 'Message',
  })

  // Start keyboard navigation at the Name field.
  await nameField.focus()
  await expect(nameField).toBeFocused()

  await page.keyboard.type('Keyboard Test User')

  // Tab should move to the Email field.
  await page.keyboard.press('Tab')
  await expect(emailField).toBeFocused()

  await page.keyboard.type('keyboard@example.com')

  // Tab should move to the Message field.
  await page.keyboard.press('Tab')
  await expect(messageField).toBeFocused()

  await page.keyboard.type(
    'Testing contact form keyboard accessibility.'
  )

  // Verify all information was entered successfully.
  await expect(nameField).toHaveValue('Keyboard Test User')

  await expect(emailField).toHaveValue('keyboard@example.com')

  await expect(messageField).toHaveValue(
    'Testing contact form keyboard accessibility.'
  )
})

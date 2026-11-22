
import { test, expect } from '@playwright/test'

test('contact form prevents submission with empty required fields', async ({ page }) => {
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  // Track any attempt to submit the contact form.
  let contactRequests = 0

  await page.route('**/api/contact_messages', async (route) => {
    contactRequests += 1

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mock response' }),
    })
  })

  await page.goto('/')

  const contactSection = page.locator('#contact')

  const submitButton = contactSection.locator('button[type="submit"]')

  await expect(submitButton).toBeVisible()

  await submitButton.click()

  // At least one required field should be invalid.
  const invalidFields = await contactSection.locator(
    'input:invalid, textarea:invalid'
  ).count()

  expect(invalidFields).toBeGreaterThan(0)

  // Empty form submission must not reach the backend.
  expect(contactRequests).toBe(0)
})


test('contact form submits valid information successfully', async ({ page }) => {
  // Keep Projects independent of the Rails backend.
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  let submittedData = null

  // Intercept the contact request before it reaches Rails.
  await page.route('**/api/contact_messages', async (route) => {
    submittedData = route.request().postDataJSON()

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Your message has been sent successfully!',
      }),
    })
  })

  await page.goto('/')

  const contactSection = page.locator('#contact')

  const name = 'Playwright Test User'
  const email = 'playwright@example.com'
  const message = 'This is an automated browser test message.'

  // Complete the form using accessible field labels.
  await contactSection.getByLabel('Name').fill(name)
  await contactSection.getByLabel('Email').fill(email)
  await contactSection.getByLabel('Message').fill(message)

  await contactSection.locator('button[type="submit"]').click()

  // Confirm the expected data was submitted.
  await expect.poll(() => submittedData).not.toBeNull()

  expect(submittedData).toMatchObject({
    contact_message: {
      name,
      email,
      message,
      website: '',
    },
  })

  // Verify the visitor receives confirmation.
  await expect(
    contactSection.getByText('Your message has been sent successfully!')
  ).toBeVisible()
})


test('contact form preserves entered information when the API fails', async ({ page }) => {
  await page.route('**/api/projects', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  )

  // Simulate a Rails server error.
  await page.route('**/api/contact_messages', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Unable to process your message.',
      }),
    })
  )

  await page.goto('/')

  const contactSection = page.locator('#contact')

  const name = 'Playwright Test User'
  const email = 'playwright@example.com'
  const message = 'This message tests contact form error handling.'

  await contactSection.getByLabel('Name').fill(name)
  await contactSection.getByLabel('Email').fill(email)
  await contactSection.getByLabel('Message').fill(message)

  await contactSection.locator('button[type="submit"]').click()

  // Verify the visitor receives an accessible error.
  const alert = contactSection.getByRole('alert')

  await expect(alert).toBeVisible()
  await expect(alert).not.toBeEmpty()

  // Verify the form retains the visitor's information.
  await expect(contactSection.getByLabel('Name')).toHaveValue(name)
  await expect(contactSection.getByLabel('Email')).toHaveValue(email)
  await expect(contactSection.getByLabel('Message')).toHaveValue(message)
})

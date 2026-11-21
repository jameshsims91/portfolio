import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Contact from './Contact'

describe('Contact component', () => {
  test('renders the contact form with accessible fileds', () => {
    render(<Contact />)

    // Verify the section heading
    expect(
      screen.getByRole('heading', {
        name: /get in touch/i,
        level: 2,
      })
    ).toBeInTheDocument()

    // Verify the name field.
    expect(
      screen.getByRole('textbox', {
        name: /your full name/i,
      })
    ).toBeRequired()

    // Verify the email field.
    expect(
      screen.getByRole('textbox', {
        name: /email address/i,
      })
    ).toBeRequired()

    // Verify the message field.
    expect(
      screen.getByRole('textbox', {
        name: /your message/i,
      })
    ).toBeRequired()

    // Verify the submit button.
    expect(
      screen.getByRole('button', {
        name: /send message/i,
      })
    ).toBeEnabled()
  })

  test('updates form fields and the message character counter', async () => {
    const user = userEvent.setup()

    render(<Contact />)

    const nameInput = screen.getByRole('textbox', {
      name: /your full name/i,
    })

    const emailInput = screen.getByRole('textbox', {
      name: /email address/i,
    })

    const messageInput = screen.getByRole('textbox', {
      name: /your message/i,
    })

    await user.type(nameInput, 'Jane Developer')
    await user.type(emailInput, 'jane@example.com')
    await user.type(messageInput, 'Hello there!')

    expect(nameInput).toHaveValue('Jane Developer')
    expect(emailInput).toHaveValue('jane@example.com')
    expect(messageInput).toHaveValue('Hello there!')

    expect(
      screen.getByText('12 / 5000 characters')
    ).toBeInTheDocument()
  })

  test('prevents submission when required fields are empty', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    try {
      render(<Contact />)

      await user.click(
        screen.getByRole('button', {
          name: /send message/i,
        })
      )

      const nameInput = screen.getByRole('textbox', {
        name: /your full name/i,
      })

      expect(nameInput).toBeInvalid()
      expect(fetchMock).not.toHaveBeenCalled()
    } finally {
      fetchMock.mockRestore()
    }
  })

  test('submits valid contact details and displays success feedback', async () => {
    const user = userEvent.setup()

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'Your message has been received successfully.',
      })
    })

    try {
      render(<Contact />)
      await user.type(
        screen.getByRole('textbox', { name: /your full name/i }),
        'Jane Developer'
      )

      await user.type(
        screen.getByRole('textbox', { name: /email address/i }),
        'jane@example.com'
      )

      await user.type(
        screen.getByRole('textbox', { name: /your message/i }),
        'I would like to discuss a development opportunity.'
      )

      const nameInput = screen.getByRole('textbox', {
        name: /your full name/i,
      })

      const emailInput = screen.getByRole('textbox', {
        name: /email address/i,
      })

      const messageInput = screen.getByRole('textbox', {
        name: /your message/i,
      })

      // Verify all fields contain the expected values.
      expect(nameInput).toHaveValue('Jane Developer')
      expect(emailInput).toHaveValue('jane@example.com')
      expect(messageInput).toHaveValue(
        'I would like to discuss a development opportunity.'
      )

      // Verify browser validation accepts all three fields.
      expect(nameInput).toBeValid()
      expect(emailInput).toBeValid()
      expect(messageInput).toBeValid()

      await user.click(
        screen.getByRole('button', { name: /send message/i })
      )

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledOnce()
      })

      const [url, options] = fetchMock.mock.calls[0]

      expect(url).toContain('/api/contact_messages')
      expect(options.method).toBe('POST')
      expect(options.headers).toEqual({
        'Content-Type': 'application/json',
      })

      expect(JSON.parse(options.body)).toEqual({
        contact_message: {
          name: 'Jane Developer',
          email: 'jane@example.com',
          message: 'I would like to discuss a development opportunity.',
          website: '',
        }
      })

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Your message has been received successfully.'
      )

      expect(
        screen.getByRole('textbox', { name: /your full name/i })
      ).toHaveValue('')

      expect(
        screen.getByRole('textbox', { name: /email address/i })
      ).toHaveValue('')

      expect(
        screen.getByRole('textbox', { name: /your message/i})
      ).toHaveValue('')
    } finally {
      fetchMock.mockRestore()
    }
  })

  test('displays API validation errors without clearing the form', async () => {
    const user = userEvent.setup()

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 422,
      json: async() => ({
        errors: ['Message is too short (minimum is 10 characters)'],
      })
    })

    try {
      render(<Contact />)

      const nameInput = screen.getByRole('textbox', {
        name: /your full name/i,
      })

      const emailInput = screen.getByRole('textbox', {
        name: /email address/i,
      })

      const messageInput = screen.getByRole('textbox', {
        name: /your message/i,
      })

      await user.type(nameInput, 'Jane Developer')
      await user.type(emailInput, 'jane@example.com')
      await user.type(
        messageInput,
        'I would like to discuss a development opportunity.'
      )

      await user.click(
        screen.getByRole('button', { name: /send message/i })
      )

      const alert = await screen.findByRole('alert')

      expect(alert).toHaveTextContent(
        'Message is too short (minimum is 10 characters)'
      )

      expect(fetchMock).toHaveBeenCalledOnce()

      // Preserve the entered information so the visitor can correct it.
      expect(nameInput).toHaveValue('Jane Developer')
      expect(emailInput).toHaveValue('jane@example.com')
      expect(messageInput).toHaveValue(
        'I would like to discuss a development opportunity.'
      )

      // The visitor can retry after correcting the problem.
      expect(
        screen.getByRole('button', { name: /send message/i })
      ).toBeEnabled()
    } finally {
      fetchMock.mockRestore()
    }
  })

  test('displays a rate-limit error when the API returns HTTP 429', async () => {
    const user = userEvent.setup()

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: 'Too many requests. Please try again later.',
      })
    })

    try {
      render(<Contact />)

      await user.type(
        screen.getByRole('textbox', { name: /your full name/i }),
        'Jane Developer'
      )

      await user.type(
        screen.getByRole('textbox', { name: /email address/i }),
        'jane@example.com'
      )

      await user.type(
        screen.getByRole('textbox', { name: /your message/i }),
        'I would like to discuss a development opportunity.'
      )

      // Submit the completed contact form.
      await user.click(
        screen.getByRole('button', { name: /send message/i })
      )

      // Wait for the HTTP 429 error alert.
      const alert = await screen.findByRole('alert')

      expect(alert).toHaveTextContent(
        'Too many requests. Please try again later.'
      )

      expect(fetchMock).toHaveBeenCalledOnce()

      expect(
        screen.getByRole('button', { name: /send message/i })
      ).toBeEnabled()
    } finally {
      fetchMock.mockRestore()
    }
  })

  test('displays an error when the network request fails', async () => {
    const user = userEvent.setup()

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Failed to fetch')
    )

    try {
      render(<Contact />)

      const nameInput = screen.getByRole('textbox', {
        name: /your full name/i,
      })

      const emailInput = screen.getByRole('textbox', {
        name: /email address/i,
      })

      const messageInput = screen.getByRole('textbox', {
        name: /your message/i,
      })

      await user.type(nameInput, 'Jane Developer')
      await user.type(emailInput, 'jane@example.com')
      await user.type(
        messageInput,
        'I would like to discuss a development opportunity.'
      )

      // Submit the completed form.
      await user.click(
        screen.getByRole('button', { name: /send message/i })
      )

      // Verify the netword failure is displayed.
      const alert = await screen.findByRole('alert')

      expect(alert).toHaveTextContent('Failed to fetch')

      expect(fetchMock).toHaveBeenCalledOnce()

      // Preseve the visitor's information
      expect(nameInput).toHaveValue('Jane Developer')
      expect(emailInput).toHaveValue('jane@example.com')
      expect(messageInput).toHaveValue(
        'I would like to discuss a development opportunity.'
      )

      // Allow another submission attempt.
      expect(
        screen.getByRole('button', { name: /send message/i })
      ).toBeEnabled()
    } finally {
      fetchMock.mockRestore()
    }
  })

  test('disables the submit button while a request is pending', async () => {
    const user = userEvent.setup()

    let resolveRequest

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        })
    )

    try {
      render(<Contact />)

      await user.type(
        screen.getByRole('textbox', { name: /your full name/i }),
        'Jane Developer'
      )

      await user.type(
        screen.getByRole('textbox', { name: /email address/i }),
        'jane@example.com'
      )

      await user.type(
        screen.getByRole('textbox', { name: /your message/i }),
        'I would like to discuss a development opportunity.'
      )

      const submitButton = screen.getByRole('button', {
        name: /send message/i,
      })

      await user.click(submitButton)

      // Verify that the request has started.
      expect(fetchMock).toHaveBeenCalledOnce()

      // Verify the loading state.
      expect(
        screen.getByRole('button', { name: /sending message/i })
      ).toBeDisabled()

      expect(
        screen.getByRole('button', { name: /sending message/i })
      ).toHaveAttribute('aria-busy', 'true')

      // Attempt another click while the request is pending.
      await user.click(
        screen.getByRole('button', { name: /sending message/i })
      )

      // No duplicate request should be sent.
      expect(fetchMock).toHaveBeenCalledOnce()

      // Complete the mocked API request.
      resolveRequest({
        ok: true,
        json: async () => ({
          message: 'Your message has been received successfully.',
        })
      })

      // Verify the form returns to its normal state.
      expect(await screen.findByRole('status')).toHaveTextContent(
        'Your message has been received successfully.'
      )

      expect(
        screen.getByRole('button', { name: /send message/i })
      ).toBeEnabled()
    } finally {
      fetchMock.mockRestore()
    }
  })


  test('moves keyboard focus to the error alert after submission fails', async () => {
    const user = userEvent.setup()

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        errors: ['Unable to process your message.'],
      }),
    })

    try {
      render(<Contact />)

      await user.type(
        screen.getByRole('textbox', { name: /your full name/i }),
        'Jane Developer'
      )

      await user.type(
        screen.getByRole('textbox', { name: /email address/i }),
        'jane@example.com'
      )

      await user.type(
        screen.getByRole('textbox', { name: /your message/i }),
        'I would like to discuss a development opportunity.'
      )

      await user.click(
        screen.getByRole('button', { name: /send message/i })
      )

      const alert = await screen.findByRole('alert')

      expect(alert).toHaveTextContent(
        'Unable to process your message.'
      )

      expect(alert).toHaveFocus()

      expect(fetchMock).toHaveBeenCalledOnce()
    } finally {
      fetchMock.mockRestore()
    }
  })
})

import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

describe('Navbar component', () => {
  test('renders the brand and navigation links', () => {
    render(<Navbar />)

    const navigation = screen.getByRole('navigation')

    // Verify branding.
    const brand = within(navigation).getByRole('link', {
      name: /james sims/i,
    })

    expect(brand).toHaveAttribute('href', '#top')

    // Verify all navigation links.
    expect(
      within(navigation).getByRole('link', { name: 'About' })
    ).toHaveAttribute('href', '#about')

    expect(
      within(navigation).getByRole('link', { name: 'Skills' })
    ).toHaveAttribute('href', '#skills')

    expect(
      within(navigation).getByRole('link', { name: 'Projects' })
    ).toHaveAttribute('href', '#projects')

    expect(
      within(navigation).getByRole('link', { name: 'Contact' })
    ).toHaveAttribute('href', '#contact')

    // Verify the resume link.
    expect(
      within(navigation).getByRole('link', {
        name: /view resume pdf in a new tab/i,
      })
    ).toBeInTheDocument()
  })

  test('opens and closes the mobile navigation menu', async () => {
    const user = userEvent.setup()

    render(<Navbar />)

    const toggleButton = screen.getByRole('button', {
      name: /toggle navigation/i
    })

    const menu = document.getElementById('portfolioNavbar')

    // The menu starts collapsed.
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton).toHaveAttribute(
      'aria-controls',
      'portfolioNavbar'
    )
    expect(menu).not.toHaveClass('show')

    // Open the mobile navigation menu.
    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveClass('show')

    // Close the mobile navigation menu.
    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('show')
  })

  test('closes the mobile menu when a navigation link is clicked', async () => {
    const user = userEvent.setup()

    render(<Navbar />)

    const toggleButton = screen.getByRole('button', {
      name: /toggle navigation/i,
    })

    const menu = document.getElementById('portfolioNavbar')

    // Open the mobile menu.
    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveClass('show')

    // Click the About navigation link.
    await user.click(
      screen.getByRole('link', { name: 'About' })
    )

    // Verify the menu closes automatically.
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('show')
  })

  test('opens the resume PDF in a new tab with secure attributes', () => {
    render(<Navbar />)

    const resumeLink = screen.getByRole('link', {
      name: /view resume pdf in a new tab/i,
    })

    // Verify the link references the bundled PDF.
    expect(resumeLink).toHaveAttribute(
      'href',
      expect.stringMatching(/\.pdf(?:$|[?#])/i)
    )

    // Verify the PDF opens in a new tab.
    expect(resumeLink).toHaveAttribute('target', '_blank')

    // Verify security attributes.
    expect(resumeLink).toHaveAttribute(
      'rel',
      expect.stringContaining('noopener')
    )

    expect(resumeLink).toHaveAttribute(
      'rel',
      expect.stringContaining('noreferrer')
    )

    // Verify the link has an accessible description.
    expect(resumeLink).toHaveAccessibleName(
      'View resume PDF in a new tab'
    )
  })


  test('renders accessible branding with a headshot and home link', () => {
    render(<Navbar />)

    const navigation = screen.getByRole('navigation')

    const headshot = within(navigation).getByRole('img', {
      name: 'Portrait of James Sims',
    })

    // Verify the headshot has descriptive alternative text.
    expect(headshot).toHaveAttribute(
      'alt',
      'Portrait of James Sims'
    )

    // Verify the headshot references an image asset.
    expect(headshot).toHaveAttribute(
      'src',
      expect.stringMatching(/\.webp(?:$|[?#])/i)
    )

    // Verify the branding identifies the portfolio owner.
    const brandLink = within(navigation).getByRole('link', {
      name: /james sims/i,
    })

    expect(brandLink).toHaveTextContent('James Sims')

    // Verify branding navigates to the top of the page.
    expect(brandLink).toHaveAttribute('href', '#top')

    // Verify the headshot is inside the branding link.
    expect(brandLink).toContainElement(headshot)
  })


  test('closes the mobile menu when the brand link is clicked', async () => {
    const user = userEvent.setup()

    render(<Navbar />)

    const toggleButton = screen.getByRole('button', {
      name: /toggle navigation/i,
    })

    const brandLink = screen.getByRole('link', {
      name: /james sims/i,
    })

    const menu = document.getElementById('portfolioNavbar')

    // Open the mobile menu.
    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveClass('show')

    // Click the branding link.
    await user.click(brandLink)

    // Verify that the menu closes.
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('show')

    // Verify that the brand still points to the top of the page.
    expect(brandLink).toHaveAttribute('href', '#top')
  })

  test.each([
    ['Skills', 'Skills'],
    ['Projects', 'Projects'],
    ['Resume', /view resume pdf in a new tab/i],
    ['Contact', 'Contact'],
  ])('closes the mobile menu when %s is clicked', async (_label, linkName) => {
    const user = userEvent.setup()

    render(<Navbar />)

    const toggleButton = screen.getByRole('button', {
      name: /toggle navigation/i,
    })

    const menu = document.getElementById('portfolioNavbar')

    // Open the mobile navigation menu.
    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(menu).toHaveClass('show')

    // Select the navigation link.
    const link = screen.getByRole('link', { name: linkName })

    // Resume opens a PDF in a new tab. Prevent actual navigation in the test.
    if (_label === 'Resume') {
      link.addEventListener('click', (event) => event.preventDefault())
    }

    await user.click(link)

    // Verify the mobile menu closes.
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('show')
  })
})

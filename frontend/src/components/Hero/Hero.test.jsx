

import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import Hero from './Hero'

describe('Hero component', () => {
  test('renders the main heading and developer introduction', () => {
    render(<Hero />)

    // Verify the main page heading.
    const heading = screen.getByRole('heading', {
      level: 1,
    })

    expect(heading).toHaveTextContent("Hi, I'm James Sims.")
    expect(heading).toHaveTextContent(
      'I build modern web applications.'
    )

    // Verify the developer role.
    expect(
      screen.getByText('Full-Stack Software Developer')
    ).toBeInTheDocument()

    // Verify the introduction describes relevant technologies.
    const description = screen.getByText(
      /I'm a full-stack software developer building responsive/i
    )

    expect(description).toHaveTextContent('React')
    expect(description).toHaveTextContent('JavaScript')
    expect(description).toHaveTextContent('Ruby on Rails')
    expect(description).toHaveTextContent('PostgreSQL')
  })

  test('renders navigation links to Projects and Contact', () => {
    render(<Hero />)

    const projectsLink = screen.getByRole('link', {
      name: 'Explore Projects',
    })

    const contactLink = screen.getByRole('link', {
      name: 'Contact Me',
    })

    // Verify the Projects link destination.
    expect(projectsLink).toHaveAttribute('href', '#projects')

    // Verify the Contact link destination.
    expect(contactLink).toHaveAttribute('href', '#contact')

    // Both actions should use accessible anchor elements.
    expect(projectsLink).toBeInTheDocument()
    expect(contactLink).toBeInTheDocument()
  })

  test('renders the developer code window with profile information', () => {
    const { container } = render(<Hero />)

    // Verify the code window filename.
    expect(screen.getByText('developer.js')).toBeInTheDocument()

    // Verify the code uses preformatted semantic markup.
    const codeWindow = container.querySelector(
      '.hero-code-content code'
    )

    expect(codeWindow).toBeInTheDocument()
    expect(codeWindow.closest('pre')).toBeInTheDocument()

    // Verify the developer object content.
    expect(codeWindow).toHaveTextContent('const developer = {')
    expect(codeWindow).toHaveTextContent('James Sims')
    expect(codeWindow).toHaveTextContent('Full-Stack Developer')
    expect(codeWindow).toHaveTextContent('React')
    expect(codeWindow).toHaveTextContent('Ruby on Rails')
    expect(codeWindow).toHaveTextContent('PostgreSQL')
    expect(codeWindow).toHaveTextContent('Building great software')
  })

  test('uses semantic section markup and hides decorative window controls', () => {
    const { container } = render(<Hero />)

    // Verify the Hero section has the expected ID.
    const heroSection = container.querySelector('section#home')

    expect(heroSection).toBeInTheDocument()
    expect(heroSection).toHaveClass('hero-section')

    // Verify the primary heading belongs to the Hero section.
    const heading = screen.getByRole('heading', { level: 1 })

    expect(heroSection).toContainElement(heading)

    // Verify the decorative window controls are hidden
    // from assistive technologies.

    const decorativeDots = container.querySelector(
      '.hero-window-dots'
    )

    expect(decorativeDots).toBeInTheDocument()
    expect(decorativeDots).toHaveAttribute('aria-hidden', 'true')

    // Verify that the decorative controls contain three dots.
    expect(decorativeDots.children).toHaveLength(3)
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import About from './About'

describe('About component', () => {
  test('renders the About Me section heading', () => {
    render(<About />)

    const heading = screen.getByRole('heading', {
      name: /about me/i,
      level: 2,
    })

    expect(heading).toBeInTheDocument()
  })

  test('displays the developer introduction', () => {
    render(<About />)

    const introduction = screen.getByRole('heading', {
      name: /passionate about building software that makes a difference/i,
      level: 3,
    })

    expect(introduction).toBeInTheDocument()
  })

  test('renders all four development highlight cards', () => {
    render(<About />)

    const expectedHighlights = [
      'Frontend Development',
      'Backend Development',
      'Development Workflow',
      'Continuous Learning',
    ]

    expectedHighlights.forEach((title) => {
      expect(
        screen.getByRole('heading', {
          name: title,
          level: 4,
        })
      ).toBeInTheDocument()
    })
  })

  test('provides an About section for page navigation', () => {
    const { container } = render(<About />)

    const aboutSection = container.querySelector('section#about')

    expect(aboutSection).toBeInTheDocument()
  })
})

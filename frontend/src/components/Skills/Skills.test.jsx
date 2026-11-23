import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import Skills from './Skills'

describe('Skills component', () => {
  test('renders the section heading and all four skill categories', () => {
    render(<Skills />)

    // Verify the main section heading.
    expect(
      screen.getByRole('heading', {
        name: /technical skills/i,
        level: 2
      })
    ).toBeInTheDocument()

    // Verify the section label.
    expect(
      screen.getByText('Technologies I Work With')
    ).toBeInTheDocument()

    // Verify all four category headings.
    expect(
      screen.getByRole('heading', {
        name: 'Frontend Development',
        level: 3
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Databases',
        level: 3,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Tools & Testing',
        level: 3,
      })
    ).toBeInTheDocument()
  })

  test.each([
    [
      'Frontend Development',
      [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React',
        'Bootstrap',
        'Tailwind CSS',
        'Responsive Design',
        'Accessibility',
      ],
    ],
    [
      'Backend Development',
      [
        'Ruby',
        'Ruby on Rails',
        'RESTful APIs',
        'MVC Architecture',
        'Authentication & Authorization',
      ],
    ],
    [
      'Databases',
      [
        'PostgreSQL',
        'SQLite',
      ],
    ],
    [
      'Tools & Testing',
      [
        'Git & GitHub',
        'GitHub Actions',
        'Vite',
        'Vitest',
        'Playwright',
        'Minitest',
        'CI/CD',
      ],
    ],
  ])('renders the correct technologies under %s', (category, technologies) => {
    render(<Skills />)

    const heading = screen.getByRole('heading', {
      name: category,
      level: 3,
    })

    const card = heading.closest('article')

    expect(card).toBeInTheDocument()

    const list = within(card).getByRole('list')
    const items = within(list).getAllByRole('listitem')

    // Verify the category contains the expected number of skills.
    expect(items).toHaveLength(technologies.length)

    // Verify the technologies appear in the correct order.
    technologies.forEach((technology, index) => {
      expect(items[index]).toHaveTextContent(technology)
    })
  })

  test('uses semantic markup and hides decorative skill icons', () => {
    const { container } = render(<Skills />)

    // Verify the Skills section and its navigation ID.
    const skillsSection = container.querySelector('section#skills')

    expect(skillsSection).toBeInTheDocument()
    expect(skillsSection).toHaveClass('skills-section')

    // Verify the section contains four skill cards.
    const cards = skillsSection.querySelectorAll('article.skills-card')

    expect(cards).toHaveLength(4)

    // Verify each card contains a heading, list, and decorative icon.
    cards.forEach((card) => {
      expect(
        within(card).getByRole('list')
      ).toBeInTheDocument()

      const icon = card.querySelector('.skills-icon-wrapper svg')

      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })
})

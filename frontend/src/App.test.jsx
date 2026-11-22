import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { mockProjects } from './test/fixtures/projects'
import App from './App'

function mockPendingProjectsRequest() {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise(() => {}))
  )
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('App integration', () => {
  test('renders a single main content landmark', () => {
    mockPendingProjectsRequest()

    render(<App />)

    expect(screen.getAllByRole('main')).toHaveLength(1)
  })

  test('renders all main portfolio sections in the correct order', () => {
    mockPendingProjectsRequest()

    const { container } = render(<App />)

    const main = screen.getByRole('main')

    const sectionIds = Array.from(
      main.querySelectorAll('section[id'),
      (section) => section.id
    )

    expect(sectionIds).toEqual([
      'home',
      'about',
      'skills',
      'projects',
      'contact',
    ])

    expect(container.querySelector('#top')).toBeInTheDocument()
  })

  test('navbar section links point to existing page elements', () => {
    mockPendingProjectsRequest()

    const { container } = render(<App />)

    const navigation = screen.getByRole('navigation')

    const sectionLinks = Array.from(
      navigation.querySelectorAll('a[href^="#"]')
    )

    expect(sectionLinks.length).toBeGreaterThan(0)

    sectionLinks.forEach((link) => {
      const targetId = link.getAttribute('href').slice(1)

      expect(targetId).not.toBe('')

      const target = container.querySelector(
        `#${CSS.escape(targetId)}`
      )

      expect(target).toBeInTheDocument()
    })
  })

  test('renders the footer outside the main content', () => {
    mockPendingProjectsRequest()

    render(<App />)

    const main = screen.getByRole('main')
    const footer = screen.getByRole('contentinfo')

    expect(footer).toBeInTheDocument()

    expect(main.contains(footer)).toBe(false)

    expect(
      main.compareDocumentPosition(footer) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  test('renders API projects within the complete application', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProjects,
      })
    )

    render(<App />)

    const projectsSection = document.getElementById('projects')

    expect(projectsSection).toBeInTheDocument()

    const projectCards = await within(projectsSection).findAllByRole(
      'article'
    )

    expect(projectCards).toHaveLength(mockProjects.length)

    mockProjects.forEach((project) => {
      const card = projectCards.find((element) =>
        within(element).queryByRole('heading', {
          name: project.title,
        })
      )

      expect(card).toBeDefined()

      expect(
        within(card).getByText(project.description)
      ).toBeInTheDocument()
    })

    // Other applicatoin landmarks remain available.
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  test('keeps the application accessible when the Projects API fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    )

    render(<App />)

    const projectsSection = document.getElementById('projects')

    expect(projectsSection).toBeInTheDocument()

    const alert = await within(projectsSection).findByRole('alert')

    expect(alert).toHaveTextContent(
      'Unable to load projects. Please try again.'
    )

    expect(
      within(projectsSection).queryByRole('article')
    ).not.toBeInTheDocument()

    // The rest of the portfolio remains accessible.
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()

    // All main sections are still present.
    for (const sectionId of [
      'home',
      'about',
      'skills',
      'projects',
      'contact',
    ]) {
      expect(document.getElementById(sectionId)).toBeInTheDocument()
    }
  })
})

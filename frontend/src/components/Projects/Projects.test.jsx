import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import Projects from './Projects'
import { mockProjects } from '../../test/fixtures/projects'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Projects component', () => {
  test('displays a loading message while fetching projects', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))

    render(<Projects />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading projects...'
    )
  })

  test('renders projects returned by the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProjects,
      })
    )

    render(<Projects />)

    const cards = await screen.findAllByRole('article')

    expect(cards).toHaveLength(mockProjects.length)

    mockProjects.forEach((project) => {
      const card = cards.find((element) =>
        within(element).queryByRole('heading', {
          name: project.title,
        })
      )

      expect(card).toBeDefined()

      expect(
        within(card).getByText(project.description)
      ).toBeInTheDocument()

      const technologies = within(card).getAllByRole('listitem')

      expect(technologies).toHaveLength(project.technologies.length)

      project.technologies.forEach((technology) => {
        expect(
          within(card).getByText(technology)
        ).toBeInTheDocument()
      })
    })
  })

  test('renders secure and accessible project links', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProjects,
      })
    )

    render(<Projects />)

    const cards = await screen.findAllByRole('article')

    mockProjects.forEach((project) => {
      const card = cards.find((element) =>
        within(element).queryByRole('heading', {
          name: project.title,
        })
      )

      expect(card).toBeDefined()

      const githubLink = within(card).queryByRole('link', {
        name: `View ${project.title} on GitHub`,
      })

      if (project.github_url) {
        expect(githubLink).toHaveAttribute('href', project.github_url)
        expect(githubLink).toHaveAttribute('target', '_blank')
        expect(githubLink).toHaveAttribute(
          'rel',
          'noopener noreferrer'
        )
      } else {
        expect(githubLink).not.toBeInTheDocument()
      }

      const liveLink = within(card).queryByRole('link', {
        name: `View live demo of ${project.title}`,
      })

      if (project.live_url) {
        expect(liveLink).toHaveAttribute('href', project.live_url)
        expect(liveLink).toHaveAttribute('target', '_blank')
        expect(liveLink).toHaveAttribute(
          'rel',
          'noopener noreferrer'
        )
      } else {
        expect(liveLink).not.toBeInTheDocument()
      }
    })
  })

  test('displays project screenshots with accessible alt text', async () => {
    const projectsWithImages = mockProjects.map((project) => ({
      ...project,
      image_url: `https://example.com/images/${project.id}.webp`,
    }))

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => projectsWithImages,
      })
    )

    render(<Projects />)

    for (const project of projectsWithImages) {
      const image = await screen.findByRole('img', {
        name: `Screenshot of ${project.title}`,
      })

      expect(image).toHaveAttribute('src', project.image_url)
      expect(image).toHaveAttribute('loading', 'lazy')
      expect(image).toHaveAttribute('decoding', 'async')
    }
  })

  test('displays a placeholder when a project has no image', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProjects,
      })
    )

    render(<Projects />)

    const cards = await screen.findAllByRole('article')

    mockProjects.forEach((project) => {
      const card = cards.find((element) =>
        within(element).queryByRole('heading', {
          name: project.title,
        })
      )

      expect(card).toBeDefined()

      if (!project.image_url) {
        expect(
          card.querySelector('.projects-image-placeholder')
        ).toBeInTheDocument()

        expect(
          within(card).queryByRole('img', {
            name: `Screenshot of ${project.title}`,
          })
        ).not.toBeInTheDocument()
      }
    })
  })

  test('displays a placeholder when a project image fails to load', async () => {
    const project = {
      ...mockProjects[0],
      image_url: 'https://example.com/images/missing.webp',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [project],
      })
    )

    render(<Projects />)

    const image = await screen.findByRole('img', {
      name: `Screenshot of ${project.title}`,
    })

    fireEvent.error(image)

    const card = screen.getByRole('article')

    expect(
      within(card).queryByRole('img', {
        name: `Screenshot of ${project.title}`,
      })
    ).not.toBeInTheDocument()

    expect(
      card.querySelector('.projects-image-placeholder')
    ).toBeInTheDocument()
  })

  test('displays an empty message when no projects are returned', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })
    )

    render(<Projects />)

    expect(
      await screen.findByText(
        'No featured projects are available yet.'
      )
    ).toBeInTheDocument()

    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    expect(
      screen.queryByText('Loading projects...')
    ).not.toBeInTheDocument()
  })

  test('displays an accessible error message when the API fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    )

    render(<Projects />)

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent(
      'Unable to load projects. Please try again.'
    )

    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    expect(
      screen.queryByText('Loading projects...')
    ).not.toBeInTheDocument()
  })

  test('displays an error message when the network request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Error('Network connection failed'))
    )

    render(<Projects />)

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent(
      'Unable to load projects. Please try again.'
    )

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('displays an error message when the API returns invalid data', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: 'This is not an array of projects',
        })
      })
    )

    render(<Projects />)

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent(
      'Unable to load projects. Please try again.'
    )

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('aborts the API request when the component unmounts', () => {
    let requestSignal

    const fetchMock = vi.fn((_url, options) => {
      requestSignal = options.signal

      return new Promise(() => {})
    })

    vi.stubGlobal('fetch', fetchMock)

    const { unmount } = render(<Projects />)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    //Verify that the request received an abort signal.
    expect(requestSignal).toBeDefined()
    expect(typeof requestSignal.addEventListener).toBe('function')
    expect(requestSignal).toBeInstanceOf(AbortSignal)
    expect(requestSignal.aborted).toBe(false)

    // Unmount the component to trigger useEffect cleanup.
    unmount()

    // Verify that the request was aborted.
    expect(requestSignal.aborted).toBe(true)
  })
})

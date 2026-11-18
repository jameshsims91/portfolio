import { useEffect, useState } from 'react'
import { Code2, ExternalLink, GitBranch } from 'lucide-react'
import './Projects.css'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/projects', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Failed to load projects: ${response.status}`
          )
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error("Invalid projects response")
        }

        setProjects(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Projects API error:", err)
          setError("Unable to load projects. Please try again.")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProjects()

    return () => controller.abort()
  }, [])

  return (
    <section id='projects' className='projects-section'>
      <div className='container'>
        {/* Section Heading */}
        <div className='projects-heading mb-5'>
          <p className='projects-label mb-2'>
            My Recent Work
          </p>
          
          <h2 className='projects-title'>
            Featured <span>Projects.</span>
          </h2>

          <div className='projects-heading-line' />

          <p className='projects-into mt-4'>
            A selection of applications I've developed using modern frontend and backend technologies. Each project highlights my skills in web development, problem-solving, and creating user-friendly interfaces.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            className='text-center py-5'
            role='status'
            aria-live='polite'
          >
            <div 
              className='spinner-border text-primary mb-3'
              aria-hidden='true'
            />

            <p className='text-light'>
              Loading projects...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && !error && projects.length === 0 && (
          <p className='projects-empty'>
            No featured projects are available yet.
          </p>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className='row row-cols-1 row-cols-md-2 g-4'>
            {projects.map((project) => (
              <div className='col' key={project.id}>
                <article className='card projects-card h-100'>
                  {/* Image Placeholder */}
                  <div className='projects-image-placeholder'>
                    <Code2 size={42} aria-hidden='true' />
                  </div>

                  <div className='card-body d-flex flex-column'>
                    <h3 className='projects-card-title'>
                      {project.title}
                    </h3>

                    <p className='projects-card-description'>
                      {project.description}
                    </p>

                    {/* Technologies Used */}
                    <ul className='projects-tech-list'>
                      {project.technologies.map((tech) => (
                        <li
                          className='projects-tech-badge'
                          key={tech}
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    {/* Project Links */}
                    <div className='projects-links mt-auto'>
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target='_blank'
                          rel='projects-link'
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <GitBranch size={18} aria-hidden='true' />
                            Github
                        </a>
                      )}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`View live demo of ${project.title}`}
                        >
                          <ExternalLink
                            size={18}
                            aria-hidden='true'
                          />
                            Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

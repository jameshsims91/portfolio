import { Monitor, Server, Database, Wrench } from 'lucide-react'
import './Skills.css'

const skillCategories = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: Monitor,
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Bootstrap',
      'Tailwind CSS',
      'Responsive Design',
      'Accessibility',
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: Server,
    skills: [
      'Ruby',
      'Ruby on Rails',
      'RESTful APIs',
      'MVC Architecture',
      'Authentication & Authorization',
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: Database,
    skills: [
      'PostgreSQL',
      'SQLite',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Testing',
    icon: Wrench,
    skills: [
      'Git & GitHub',
      'GitHub Actions',
      'Vite',
      'Vitest',
      'Playwright',
      'Minitest',
      'CI/CD',
    ],
  },
]

export default function Skills() {
  return (
    <section id='skills' className='skills-section'>
      <div className='container'>
        {/* Section Heading */}
        <div className='skills-heading mb-5'>
          <p className='skills-label mb-2'>
            Technologies I Work With
          </p>

          <h2 className='skills-title'>
            Technical <span>Skills.</span>
          </h2>

          <div className='skills-heading-line' />

          <p className='skills-intro mt-4'>
            My technical toolkit spans frontend development,
            backend APIs, databases, and automated testing.
            I use these technologies to build accessible,
            maintainable applications and deliver reliable
            features from development through deployment.
          </p>
        </div>

        {/* SKills Grid */}
        <div className='row row-cols-1 row-cols-md-2 g-4'>
          {skillCategories.map((category) => {
            const Icon = category.icon

            return (
              <div className='col' key={category.id}>
                <article className='skills-card h-100'>
                  {/* Card Header */}
                  <div className='skills-card-header'>
                    <div className='skills-icon-wrapper'>
                      <Icon size={26} aria-hidden='true' />
                    </div>

                    <h3 className='skills-card-title'>
                      {category.title}
                    </h3>
                  </div>

                  {/* Technology Badges */}
                  <ul className='skills-list'>
                    {category.skills.map((skill) => (
                      <li className='skills-badge' key={skill}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

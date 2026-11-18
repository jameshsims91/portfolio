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
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: Server,
    skills: [
      'Ruby',
      'Ruby on Rails',
      'PostgreSQL',
      'RESTful APIs',
      'MVC Architecture',
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
      'Vite',
      'Vitest',
      'Minitest',
      'Jest',
      'RSpec',
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
            The tools and technologies I use to build responsive, reliable, and maintainable web applications. I am constantly learning and expanding my skill set to stay up-to-date with the latest trends and best practices in web development.
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

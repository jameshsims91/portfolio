import { Code2, Layers, Database, GitBranch, GraduationCap } from 'lucide-react'
import './About.css'

const highlights = [
  {
    title: 'Frontend Development',
    description: "React, Webpack, JavaScript, HTML, CSS, Bootstrap, Tailwind CSS, Responsive Design, Accessibility",
    icon: Layers,
  },
  {
    title: 'Backend Development',
    description: 'Ruby, Ruby on Rails, PostgreSQL, RESTful APIs, MVC Architecture, Authentication & Authorization, Minitest',
    icon: Database,
  },
  {
    title: 'Development Workflow',
    description: 'Git, GitHub, GitHub Actions, Vitest, Playwright, Automated Testing, CI/CD',
    icon: GitBranch,
  },
  {
    title: 'Continuous Learning',
    description: 'The Odin Project — Full Stack Ruby on Rails, Independent Projects, Ruby and JavaScript Practice, Continuous Skill Development',
    icon: GraduationCap,
  }
]

export default function About() {
  return (
    <section id='about' className='about-section'>
      <div className='container'>
        {/* Section Heading */}
        <div className='about-heading mb-5'>
          <p className='about-label mb-2'>
            Get To Know Me
          </p>

          <h2 className='about-title'>
            About <span>Me.</span>
          </h2>

          <div className='about-heading-line' />
        </div>

        <div className='row align-items-center g-4 g-lg-5'>
          {/* About Description */}
          <div className='col-12 col-lg-6'>
            <div className='about-content'>
              <div className='about-icon mb-4'>
                <Code2 size={28} aria-hidden='true' />
              </div>

              <h3 className='about-subtitle mb-3'>
                Passionate About Building Software That Makes a Difference
              </h3>

              <p>
                I'm a full-stack software developer who enjoys building
                applications that combine intuitive user interfaces with
                reliable backend systems. I work with React, JavaScript,
                Ruby on Rails, and PostgreSQL to develop responsive,
                accessible applications that solve practical problems.
              </p>

              <p>
                My projects include a full-stack messaging application,
                an interactive photo-tagging game, a React shopping cart,
                and a weather dashboard. Through these projects, I've
                gained hands-on experience with REST APIs, authentication,
                database relationships, state management, and testing
                frontend and backend functionality.
              </p>

              <p>
                After completing The Odin Project's Full Stack Ruby on
                Rails curriculum, I've continued strengthening my skills
                through independent projects, automated testing, and
                deployment. I use tools such as Git, GitHub Actions,
                Vitest, and Playwright to build, test, and improve my
                applications. I'm excited to contribute these skills
                to a collaborative software development team.
              </p>
            </div>
          </div>

          {/* Highligh Cards */}
          <div className='col-12 col-lg-6'>
            <div className='row row-cols-1 row-cols-sm-2 g-3'>
              {highlights.map((item) => {
                const Icon = item.icon

                return (
                  <div className='col' key={item.title}>
                    <div className='about-card h-100'>
                      <Icon className='about-card-icon mb-3' size={28} aria-hidden='true' />

                      <h4 className='about-card-title'>
                        {item.title}
                      </h4>

                      <p className='about-card-description mb-0'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

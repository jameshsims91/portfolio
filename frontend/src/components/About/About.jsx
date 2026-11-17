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
    description: 'Ruby, Ruby on Rails, PostgreSQL, RESTful APIs, MVC Architecture, Authentication & Authorization, Testing (RSpec)',
    icon: Database,
  },
  {
    title: 'Development Workflow',
    description: 'Git, Github, Automated Testing, Code Reviews',
    icon: GitBranch,
  },
  {
    title: 'Continuous Learning',
    description: 'The Odin Project - Full Stack Ruby on Rails Curriculum, WordPress Development, Online Courses, Open Source Contributions, Tech Meetups',
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
                I'm a full-stack software developer focused on building responsive, accessible, and maintainable web applications. I enjoy collaborating with others to create software that solves real-world problems and enhances user experiences. My goal is to continuously learn and grow as a developer while contributing to meaningful projects.
              </p>

              <p>
                My development experience includes working with a variety of technologies, including React, Ruby on Rails, PostgreSQL, and more.I enjoy exploring new tools and frameworks, and I'm always looking for opportunities to expand my skill set. I believe that software development is a constantly evolving field, and I strive to stay up-to-date with the latest trends and best practices.
              </p>

              <p>
                After complete the Odin Project's Full Stack Ruby on Rails curriculum, I've continued strengthening my skills through personal projects, projects involving REST APIs, authentication, database relationships, and more. I also enjoy contributing to open source projects and participating in online communities to share knowledge and learn from others.
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

import './Hero.css'

export default function Hero() {
  return (
    <section id='home' className='hero-section'>
      <div className='container'>
        <div className='row align-items-center g-5'>
          {/* Left Column: Introduction */}
          <div className='col-12 col-lg-7'>
            <div className='hero-content'>
              <p className='hero-label mb-3'>
                <span className='hero-status-dot'></span>
                Full-Stack Software Developer
              </p>

              <h1 className='hero-title mb-3'>
                Hi, I'm James Sims.
                <span className='hero-title-accent d-block'>
                  I build modern web applications.
                </span>
              </h1>

              <p className='hero-description mb-4'>
                I'm a full-stack software developer building responsive,
                accessible web applications with React, JavaScript,
                Ruby on Rails, and PostgreSQL. From authentication and
                REST APIs to interactive user interfaces, I enjoy turning
                ideas into reliable, thoughtfully designed software.
                Explore my projects to see how I approach development,
                testing, and problem-solving.
              </p>

              <div className='hero-actions d-flex flex-wrap gap-3'>
                <a href='#projects' className='btn btn-primary btn-lg hero-primary-btn'>
                  Explore Projects
                </a>
                <a href='#contact' className='btn btn-outline-light btn-lg'>
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Developer Code Window */}
          <div className='col-12 col-lg-5'>
            <div className='hero-code-window'>
              <div className='hero-code-header'>
                <div className='hero-window-dots' aria-hidden='true'>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>developer.js</span>
              </div>

              <pre className='hero-code-content'>
                <code>
                  <span className="code-purple">const</span>
                  {" developer = {\n"}
                  {"  "}
                  <span className="code-blue">name</span>
                  {": "}
                  <span className="code-green">"James Sims"</span>
                  {",\n"}
                  {"  "}
                  <span className="code-blue">role</span>
                  {": "}
                  <span className="code-green">
                    "Full-Stack Developer"
                  </span>
                  {",\n"}
                  {"  "}
                  <span className="code-blue">skills</span>
                  {": [\n"}
                  {"    "}
                  <span className="code-green">"React"</span>
                  {",\n"}
                  {"    "}
                  <span className="code-green">"Ruby on Rails"</span>
                  {",\n"}
                  {"    "}
                  <span className="code-green">"PostgreSQL"</span>
                  {"\n  ],\n"}
                  {"  "}
                  <span className="code-blue">passion</span>
                  {": "}
                  <span className="code-green">
                    "Building great software"
                  </span>
                  {"\n};"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

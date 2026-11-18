import { ArrowUp, Code2 } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import './Footer.css'

const navigationLinks = [
  { label: 'Home', href: '#home'},
  { label: 'About', href: '#about'},
  { label: 'Skills', href: '#skills'},
  { label: 'Projects', href: '#projects'},
  { label: 'Contact', href: '#contact'},
]

const socialLinks = [
  { label: 'GitHub',
    href: 'https://github.com/jameshsims91',
    icon: FaGithub,
  },
  { label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/james-simsiv/',
    icon: FaLinkedin,
  },
  { label: 'X (formerly Twitter)',
    href: 'https://x.com/JamesHSimsIV',
    icon: FaXTwitter,
  }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='portfolio-footer'>
      <div className='container'>
        <div className='row g-4 g-lg-5'>
          {/* Personal Branding */}
          <div className='col-12 col-md-6 col-lg-5'>
            <div className='footer-brand'>
              <a
                href='#top'
                className='footer-logo'
                aria-label='James Sims - Back to top'
              >
                <Code2 size={26} aria-hidden='true' />
                James <span>Sims.</span>
              </a>

              <p className='footer-description mt-3'>
                Full-Stack Software Developer focused on creating responsive, accessible, and user-friendly web applications.
              </p>

              {/* Social Links */}
              <div className='footer-social-links'>
                {socialLinks
                  .filter((social) => social.href)
                  .map((social) => {
                    const Icon = social.icon

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='footer-social-link'
                        aria-label={`Visit my ${social.label} profile`}
                      >
                        <Icon size={20} aria-hidden='true' />
                      </a>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className='col-12 col-md-6 col-lg-4'>
            <div className='footer-navigation'>
              <h2 className='footer-heading'>
                Quick Links
              </h2>

              <ul className='footer-nav-list'>
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Call to Action */}
          <div className='col-12 col-lg-3'>
            <div className='footer-contact'>
              <h2 className='footer-heading'>
                Let's Connect
              </h2>

              <p>
                Interested in working together or discussing an opportunity? Feel free to reach out via email or connect with me on LinkedIn. I'm always open to new collaborations and exciting projects!
              </p>

              <a
                href='#contact'
                className='btn footer-contact-btn'
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='footer-bottom'>
          <p className='mb-0'>
            © {currentYear} James Sims. All rights reserved.
          </p>

          <a href='#top' className='footer-back-to-top'>
            Back to Top
            <ArrowUp size={18} aria-hidden='true' />
          </a>
        </div>
      </div>
    </footer>
  )
}

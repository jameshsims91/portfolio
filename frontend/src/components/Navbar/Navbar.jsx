import { useState } from 'react'
import headshot from '../../assets/headshot.webp'
import resume from '../../assets/resume.pdf'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm'>
      <div className='container'>
        <a className='navbar-brand fw-bold' href='#top' onClick={closeMenu}>
          <img src={headshot} alt='Headshot' className='img-fluid rounded-circle mx-auto p-2' style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          <span>James Sims</span>
        </a>

        <button
          className='navbar-toggler'
          type='button'
          onClick={toggleMenu}
          aria-controls='portfolioNavbar'
          aria-expanded={menuOpen}
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id='portfolioNavbar'>
          <ul className='navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-3'>
            <li className='nav-item'>
              <a className='nav-link' href='#projects' onClick={closeMenu}>
                Projects
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#skills' onClick={closeMenu}>
                Skills
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#about' onClick={closeMenu}>
                About
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link fw-bold text-danger' href={resume} target='_blank' rel='noopener noreferrer' onClick={closeMenu} aria-label='View resume PDF in a new tab'>
                Resume
              </a>
            </li>
            <li className='nav-item'>
              <a className='btn btn-primary btn-sm ms-lg-2' href='#contact' onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

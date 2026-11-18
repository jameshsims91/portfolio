import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import './Contact.css'

const initialFormData = {
  name: '',
  email: '',
  message: '',
}

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setSuccess('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent duplicate submissions
    if (submitting) return

    setSubmitting(true)
    setSuccess('')
    setError('')

    try {
      const response = await fetch('/api/contact_messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_message: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (Array.isArray(data.errors)) {
          throw new Error(data.errors.join(' '))
        }

        throw new Error(data.error || 'Unable to send your message.'
        )
      }

      setSuccess(
        data.message || 'Your message was received successfully.'
      )

      // Reset the form after a successful submission.
      setFormData(initialFormData)
    } catch (err) {
      console.error('Contact from error: err')

      setError(
        err.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id='contact' className='contact-section'>
      <div className='container'>
        {/* Section Heading */}
        <div className='contact-heading mb-5'>
          <p className='contact-label mb-2'>
            Let's Connect
          </p>

          <h2 className='contact-title'>
            Get In <span>Touch.</span>
          </h2>

          <div className='contact-heading-line' />

          <p className='contact-intro mt-4'>
            Have a job opportunity, a project idea, or a question? I'd love to hear from you! Please fill out the form below or reach out via email or social media. Let's collaborate and create something amazing together!
          </p>
        </div>

        <div className='row g-5 align-items-start'>
          {/* Left Column: Contact Information */}
          <div className='col-12 col-lg-5'>
            <div className='contact-info'>
              <h3 className='contact-subtitle mb-3'>
                Let's Work Together!
              </h3>

              <p className='contact-description mb-4'>
                I'm interested in opportunities to contribute to meaningful software projects, collaborate with other developers, and continue growing as a full-stack developer. If you have a project in mind or just want to say hello, please reach out!
              </p>

              <div className='contact-info-list'>
                <div className='contact-info-item'>
                  <div className='contact-info-icon'>
                    <Mail size={22} aria-hidden='true' />
                  </div>

                  <div>
                    <h4>Email</h4>
                    <p>Reach out using the contact form</p>
                  </div>
                </div>

                <div className='contact-info-item'>
                  <div className='contact-info-icon'>
                    <FaGithub size={22} aria-hidden='true' />
                  </div>

                  <div>
                    <h4>GitHub</h4>
                    <p>Explore my development projects</p>
                  </div>
                </div>

                <div className='contact-info-item'>
                  <div className='contact-info-icon'>
                    <FaLinkedin size={22} aria-hidden='true' />
                  </div>

                  <div>
                    <h4>LinkedIn</h4>
                    <p>Connect with me professionally</p>
                  </div>
                </div>
              </div>

              {/* Add actual profile URLs before enabling */}
              <div className='contact-social-links mt-4'>
                <span className='contact-social-note'>
                  Professional profile links coming soon!
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className='col-12 col-lg-7'>
            <div className='contact-form-card'>
              <h3 className='contact-form-title mb-4'>
                <Send size={23} aria-hidden='true' />
                Send Me a Message
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Success Message */}
                
                {/* Name */}
                <div className='mb-4'>
                  <label
                    htmlFor='contact-name'
                    className='form-label'
                  >
                    Your Name
                  </label>

                  <input
                    type='text'
                    id='contact-name'
                    name='name'
                    className='form-control contact-input'
                    placeholder='Enter your name'
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    autoComplete='name'
                    required
                  />
                </div>

                {/* Email */}
                <div className='mb-4'>
                  <label
                    htmlFor='contact-email'
                    className='form-label'
                  >
                    Email Address
                  </label>

                  <input
                    type='email'
                    id='contact-email'
                    name='email'
                    className='form-control contact-input'
                    placeholder='you@example.com'
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={254}
                    autoComplete='email'
                    required
                  />
                </div>

                {/* Message */}
                <div className='mb-4'>
                  <label
                    htmlFor='contact-message'
                    className='form-label'
                  >
                    Your Message
                  </label>

                  <textarea
                    id='contact-message'
                    name='message'
                    className='form-control contact-input contact-textarea'
                    placeholder='Tell me about your opportunity or project...'
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={5000}
                    required
                  />
                  <div className='contact-character-count'>
                    {formData.message.length} / 5000 characters
                  </div>
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  className='btn contact-submit-btn w-100'
                >
                  <Send size={18} aria-hidden='true' />
                  Send Message
                </button>

                <p className='contact-form-note mt-3 mb-0'>
                  Form submissions are not enabled yet.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

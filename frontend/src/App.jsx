import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'

export default function App() {
  return (
    <div id='top'>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
      </main>
    </div>
  )
}

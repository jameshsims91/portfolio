projects = [
  {
    title: 'Full-Stack Messaging App',
    description: 'A full-stack messaging application built with Ruby on Rails and React. Features user authentication, customizable profiles, conversations, message history, and RESTful API communication.',
    technologies: [
      'Ruby',
      'Ruby on Rails',
      'React',
      'JavaScript',
      'PostgreSQL',
      'REST API'
    ],
    github_url: "https://github.com/jameshsims91/messaging-app",
    live_url: "https://messaging-app-kuax.onrender.com/",
    image_url: "/projects/messaging-app.webp",
    featured: true,
    position: 1
  },
  {
    title: "Photo Tagging Game",
    description: "An interactive photo tagging game featuring server-side target validation, game sessions, scoring, and a leaderboard. Uses a Rails backend to validate guesses and manage gameplay data.",
    technologies: [
      "Ruby",
      "Ruby on Rails",
      "React",
      "JavaScript",
      "REST API"
    ],
    github_url: nil,
    live_url: nil,
    image_url: nil,
    featured: true,
    position: 2
  },
  {
    title: "React Shopping Cart",
    description: "A responsive shopping cart application featuring product listings, reusable React components, quantity controls, cart totals, and automated testing using Vitest and React Testing Library.",
    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "React Router",
      "Vitest"
    ],
    github_url: "https://github.com/jameshsims91/shopping-cart",
    live_url: "https://jameshsims.me/shopping-cart/",
    image_url: "/projects/shopping-cart.webp",
    featured: true,
    position: 3
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with location search, current weather conditions, multi-day forecasts, weather icons, and external API integration using JavaScript and Webpack.",
    technologies: [
      "JavaScript",
      "HTML",
      "CSS",
      "Webpack",
      "REST API"
    ],
    github_url: "https://github.com/jameshsims91/weather-app",
    live_url: "https://jameshsims.me/weather-app/",
    image_url: "/projects/weather-app.webp",
    featured: true,
    position: 4
  }
]

projects.each do | attributes |
  project = Project.find_or_initialize_by(
    title: attributes[:title]
  )

  project.assign_attributes(attributes)
  project.save!

  puts "Seeded: #{project.title}"
end

puts "Total projects: #{Project.count}"

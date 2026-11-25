
projects = [
  {
    title: "OdinBook — Social Networking Platform",
    description: "A production-deployed social networking platform featuring secure authentication, personalized profiles, social feeds, friendships, notifications, and private image storage. Includes an isolated, read-only recruiter demo, 115 automated tests, and a continuous integration and deployment pipeline.",
    technologies: [
      "Ruby",
      "Ruby on Rails",
      "PostgreSQL",
      "JavaScript",
      "Hotwire",
      "Active Storage",
      "Supabase",
      "CI/CD"
    ],
    github_url: "https://github.com/jameshsims91/odin-book",
    live_url: "https://odinbook.jameshsims.tech/",
    image_url: "/projects/odin-book.webp",
    featured: true,
    position: 1
  },
  {
    title: "Full-Stack Messaging App",
    description: "A full-stack messaging application built with Ruby on Rails and React. Features user authentication, customizable profiles, conversations, message history, and RESTful API communication.",
    technologies: [
      "Ruby",
      "Ruby on Rails",
      "React",
      "JavaScript",
      "PostgreSQL",
      "REST API"
    ],
    github_url: "https://github.com/jameshsims91/messaging-app",
    live_url: "https://messaging-app-kuax.onrender.com/",
    image_url: "/projects/messaging-app.webp",
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

projects.each do |attributes|
  project = Project.find_or_initialize_by(
    title: attributes[:title]
  )

  project.assign_attributes(attributes)
  project.save!

  puts "Seeded: #{project.title}"
end

Project.where(title: "Photo Tagging Game").update_all(featured: false)

puts "Total projects: #{Project.count}"
puts "Featured projects: #{Project.featured.count}"

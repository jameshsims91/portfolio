require "test_helper"

class ProjectsApiTest < ActionDispatch::IntegrationTest
  setup do
    Project.delete_all

    @first_project = Project.create!(
      title: "Messaging App",
      description: "A full-stack messaging application.",
      technologies: ["Rails", "React"],
      featured: true,
      position: 1
    )

    @second_project = Project.create!(
      title: "Shopping Cart",
      description: "A responsive shopping application.",
      technologies: ["React", "JavaScript"],
      featured: true,
      position: 2
    )

    @hidden_project = Project.create!(
      title: "Unpublished Project",
      description: "This should not appear in the API.",
      technologies: ["Ruby"],
      featured: false,
      position: 3
    )
  end

  test "GET /api/projects returns only featured projects" do 
    get "/api/projects"

    assert_response :success

    projects = JSON.parse(response.body)

    assert_equal 2, projects.length

    titles = projects.map { |project| project["title"] }

    assert_includes titles, "Messaging App"
    assert_includes titles, "Shopping Cart"
    assert_not_includes titles, "Unpublished Project"
  end

  test "GET /api/projects returns projects in position order" do
    get "/api/projects"

    projects = JSON.parse(response.body)

    assert_equal(
      ["Messaging App", "Shopping Cart"],
      projects.map { |project| project["title"] }
    )
  end

  test "GET /api/projects includes expected project attributes" do
    get "/api/projects"

    projects = JSON.parse(response.body)

    first_project = projects.first

    expected_keys = %w[
      id
      title
      description
      technologies
      github_url
      live_url
      image_url
      featured
      position
    ]

    assert_equal expected_keys.sort, first_project.keys.sort

    assert_equal ["Rails", "React"],
                 first_project["technologies"]
  end

  test "GET /api/projects does not expose timestamps" do
    get "/api/projects"

    projects = JSON.parse(response.body)

    projects.each do | project |
      assert_not project.key?("created_at")
      assert_not project.key?("updated_at")
    end
  end

  test "GET /api/projects returns an empty array when no projects are featured" do
    Project.update_all(featured: false)

    get "/api/projects"

    assert_response :success
    assert_equal [], JSON.parse(response.body)
  end
end

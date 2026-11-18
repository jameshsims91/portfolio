module Api
  class ProjectsController < ApplicationController
    def index
      projects = Project.featured.ordered

      render json: projects.as_json(
        only: [
          :id,
          :title,
          :description,
          :technologies,
          :github_url,
          :live_url,
          :image_url,
          :featured,
          :position
        ]
      )
    end
  end
end

Rails.application.routes.draw do
  namespace :api do
    get "hello" => "hello#index"

    resources :projects, only: [ :index ]
    resources :contact_messages, only: [ :create ]
  end

  get "up" => "rails/health#show", as: :rails_health_check
end

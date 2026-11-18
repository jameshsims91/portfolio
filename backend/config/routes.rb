Rails.application.routes.draw do
  namespace :api do
    get "hello" => "hello#index"

    resources :projects, only: [:index]
  end
  
  get "up" => "rails/health#show", as: :rails_health_check
end

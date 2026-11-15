Rails.application.routes.draw do
  namespace :api do
    get "hello" => "hello#index"
  end
  
  get "up" => "rails/health#show", as: :rails_health_check
end

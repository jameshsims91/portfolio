# Be sure to restart your server when you modify this file.

frontend_origins = ENV.fetch(
  "FRONTEND_ORIGINS",
  "http://localhost:5173,http://localhost:4173"
).split(",").map(&:strip).reject(&:empty?)

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*frontend_origins)

    resource "/api/*",
      headers: :any,
      methods: [ :get, :post, :options ]
  end
end

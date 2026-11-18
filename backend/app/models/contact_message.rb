class ContactMessage < ApplicationRecord
  validates :name,
            presence: true,
            length: { maximum: 100 }
  
  validates :email,
            presence: true,
            length: { maximum: 254 },
            format: {
              with: URI::MailTo::EMAIL_REGEXP,
              message: "must be a valid email address"
            }

  validates :message,
            presence: true,
            length: {
              minimum: 10,
              maximum: 5000
            }
end

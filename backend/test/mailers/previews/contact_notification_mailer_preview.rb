# Preview all emails at http://localhost:3000/rails/mailers/contact_notification_mailer
class ContactNotificationMailerPreview < ActionMailer::Preview
  def new_message
    contact_message = ContactMessage.new(
      name: "Jane Developer",
      email: "jane@example.com",
      message: "Hello, I would like to discuss a development opportunity.",
      created_at: Time.current
    )

    ContactNotificationMailer.new_message(contact_message)
  end
end

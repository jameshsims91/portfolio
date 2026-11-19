class ContactNotificationMailer < ApplicationMailer
  def new_message(contact_message)
    @contact_message = contact_message

    mail(
      to: ENV.fetch("CONTACT_NOTIFICATION_EMAIL"),
      reply_to: @contact_message.email,
      subject: "New Portfolio Contact: #{@contact_message.name}"
    )
  end
end

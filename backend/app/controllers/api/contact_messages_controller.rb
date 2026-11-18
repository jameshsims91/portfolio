module Api
  class ContactMessagesController < ApplicationController
    rate_limit to: 5,
               within: 10.minutes,
               only: :create,
               with: -> {
                render json: {
                  error: "Too many messages. Please try again later."
                }, status: :too_many_requests
               }

    def create
      # Silently discared suspected bot submissions.
      if params.dig(:contact_message, :website).to_s.strip.present?
        return render json: {
          message: "Your message has been received successfully."
        }, status: :created
      end
      
      contact_message = ContactMessage.new(contact_message_params)

      if contact_message.save
        render json: {
          message: "Your message has been received successfully."
        }, status: :created
      else
        render json: {
          errors: contact_message.errors.full_messages
        }, status: :unprocessable_entity
      end
    end

    private

    def contact_message_params
      params.require(:contact_message).permit(
        :name,
        :email,
        :message
      )
    end
  end
end

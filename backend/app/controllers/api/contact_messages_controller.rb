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
        begin
          queued_job = ContactNotificationMailer
            .new_message(contact_message)
            .deliver_later

          unless queued_job
            Rails.logger.error(
              "Contact notification was not enqueued for message ##{contact_message.id}"
            )
          end
        rescue SolidQueue::Job::EnqueueError => e
          Rails.logger.error(
            "Contact notification enqueue failed for message ##{contact_message.id}: #{e.class}"
          )
        end

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

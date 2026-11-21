require "test_helper"

class ContactNotificationMailerPreviewTest < ActiveSupport::TestCase
  test "preview generates a contact notification email" do
    original_email = ENV["CONTACT_NOTIFICATION_EMAIL"]
    ENV["CONTACT_NOTIFICATION_EMAIL"] = "preview@example.com"

    begin
      email = ContactNotificationMailerPreview.new.new_message

      assert_equal [ "preview@example.com" ], email.to
      assert_equal [ "jane@example.com" ], email.reply_to
      assert_equal "New Portfolio Contact: Jane Developer", email.subject

      body = email.multipart? ? email.text_part.decoded : email.body.decoded

      assert_includes body, "Jane Developer"
      assert_includes body, "jane@example.com"
      assert_includes body,
        "I would like to discuss a development opportunity."
    ensure
      if original_email.nil?
        ENV.delete("CONTACT_NOTIFICATION_EMAIL")
      else
        ENV["CONTACT_NOTIFICATION_EMAIL"] = original_email
      end
    end
  end
end

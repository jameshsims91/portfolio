
require "test_helper"

class ContactNotificationMailerTest < ActionMailer::TestCase
  test "new message notification" do
    contact_message = ContactMessage.new(
      name: "Jane Developer",
      email: "jane@example.com",
      message: "Hello! I would like to discuss a project.",
      created_at: Time.find_zone!("America/New_York").local(
        2026, 11, 19, 16, 30
      )
    )

    original_email = ENV["CONTACT_NOTIFICATION_EMAIL"]
    ENV["CONTACT_NOTIFICATION_EMAIL"] = "portfolio-owner@example.com"

    begin
      email = ContactNotificationMailer.new_message(
        contact_message
      ).deliver_now

      assert_equal ["portfolio-owner@example.com"], email.to
      assert_equal ["jane@example.com"], email.reply_to

      assert_equal(
        "New Portfolio Contact: Jane Developer",
        email.subject
      )

      body = email.body.decoded

      assert_includes body, "Jane Developer"
      assert_includes body, "jane@example.com"
      assert_includes body, "Hello! I would like to discuss a project."
      assert_includes body, "November 19, 2026"
      assert_includes body, "04:30:00 PM EST"
    ensure
      if original_email.nil?
        ENV.delete("CONTACT_NOTIFICATION_EMAIL")
      else
        ENV["CONTACT_NOTIFICATION_EMAIL"] = original_email
      end
    end
  end
end

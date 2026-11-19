require "test_helper"

class Api::ContactMessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    Rails.cache.clear
  end

  teardown do
    Rails.cache.clear
  end

  test "POST /api/contact_messages limits requests to five per ten minutes" do
    invalid_params = {
      contact_message: {
        name: "",
        email: "test@example.com",
        message: "Testing contact form rate limiting."
      }
    }

    assert_no_difference "ContactMessage.count" do
      5.times do
        post "/api/contact_messages",
             params: invalid_params,
             as: :json

        assert_response :unprocessable_entity
      end

      post "/api/contact_messages",
           params: invalid_params,
           as: :json

      assert_response :too_many_requests
    end
  end
end

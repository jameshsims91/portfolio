require "test_helper"

class ContactMessagesApiTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper
  setup do
    Rails.cache.clear

    @valid_params = {
      contact_message: {
        name: "Test Recruiter",
        email: "recruiter@example.com",
        message: "I'd like to discuss a software development opportunity."
      }
    }
  end

  test "POST /api/contact_messages creates a valid message" do
    assert_difference "ContactMessage.count", 1 do
      assert_enqueued_emails 1 do
        post "/api/contact_messages",
             params: @valid_params,
             as: :json
      end
    end

    assert_response :created

    response_body = JSON.parse(response.body)

    assert_equal(
      "Your message has been received successfully.",
      response_body["message"]
    )

    saved_message = ContactMessage.last

    assert_equal "Test Recruiter", saved_message.name
    assert_equal "recruiter@example.com", saved_message.email
    assert_equal(
      @valid_params[:contact_message][:message],
      saved_message.message
    )
  end

  test "POST rejects a missing name" do
    invalid_params = {
      contact_message: @valid_params[:contact_message].merge(
        name: ""
      )
    }

    assert_no_difference "ContactMessage.count" do
      post "/api/contact_messages", params:invalid_params,
                                    as: :json
    end

    assert_response :unprocessable_entity

    errors = JSON.parse(response.body)["errors"]

    assert_includes errors, "Name can't be blank"
  end

  test "POST rejects an invalid email address" do
    invalid_params = {
      contact_message: @valid_params[:contact_message].merge(
        email: "not-an-email"
      )
    }

    assert_no_difference "ContactMessage.count" do
      post "/api/contact_messages", params: invalid_params,
                                    as: :json
    end

    assert_response :unprocessable_entity

    errors = JSON.parse(response.body)["errors"]

    assert_includes(
      errors,
      "Email must be a valid email address"
    )
  end

  test "POST rejects messages shorter than 10 characters" do
    invalid_params = {
      contact_message: @valid_params[:contact_message].merge(
        message: "Hi"
      )
    }

    assert_no_difference "ContactMessage.count" do
      post "/api/contact_messages", params: invalid_params,
                                    as: :json
    end

    assert_response :unprocessable_entity

    errors = JSON.parse(response.body)["errors"]

    assert_includes(
      errors,
      "Message is too short (minimum is 10 characters)"
    )
  end

  test "POST ignores unpermitted attributes" do
    submitted_params = {
      contact_message: @valid_params[:contact_message].merge(
        id: 999_999,
        created_at: "2000-01-01T00:00:00Z"
      )
    }

    assert_difference "ContactMessage.count", 1 do
      post "/api/contact_messages", params: submitted_params,
                                    as: :json
    end

    assert_response :created

    saved_message = ContactMessage.last

    assert_not_equal 999_999, saved_message.id
    assert_operator saved_message.created_at.year, :>, 2000
  end

  test "GET /api/contact_messages is not publicly available" do
    assert_no_difference "ContactMessage.count" do
      get "/api/contact_messages"
    end

    assert_response :not_found
  end

  test "POST silently discards honeypot submissions" do
    spam_params = {
      contact_message: @valid_params[:contact_message].merge(
        website: "https://spam-example.invalid"
      )
    }

    assert_no_difference "ContactMessage.count" do
      assert_enqueued_emails 0 do
        post "/api/contact_messages",
             params: spam_params,
             as: :json
      end
    end

    assert_response :created

    response_body = JSON.parse(response.body)

    assert_equal(
      "Your message has been received successfully.",
      response_body["message"]
    )
  end
end

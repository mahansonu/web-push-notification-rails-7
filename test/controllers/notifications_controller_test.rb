require "test_helper"

class NotificationsControllerTest < ActionDispatch::IntegrationTest
  test "should get subscribe" do
    get notifications_subscribe_url
    assert_response :success
  end
end

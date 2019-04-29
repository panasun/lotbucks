require 'test_helper'

class AdminControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_index_url
    assert_response :success
  end

  test "should get round" do
    get admin_round_url
    assert_response :success
  end

  test "should get request" do
    get admin_request_url
    assert_response :success
  end

  test "should get transaction" do
    get admin_transaction_url
    assert_response :success
  end

  test "should get user" do
    get admin_user_url
    assert_response :success
  end

  test "should get stat" do
    get admin_stat_url
    assert_response :success
  end

end

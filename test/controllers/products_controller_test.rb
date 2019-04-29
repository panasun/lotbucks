require 'test_helper'

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "should get thai" do
    get products_thai_url
    assert_response :success
  end

  test "should get laos" do
    get products_laos_url
    assert_response :success
  end

end

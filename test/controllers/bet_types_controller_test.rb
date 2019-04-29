require 'test_helper'

class BetTypesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @bet_type = bet_types(:one)
  end

  test "should get index" do
    get bet_types_url
    assert_response :success
  end

  test "should get new" do
    get new_bet_type_url
    assert_response :success
  end

  test "should create bet_type" do
    assert_difference('BetType.count') do
      post bet_types_url, params: { bet_type: { code: @bet_type.code, name: @bet_type.name, odd: @bet_type.odd } }
    end

    assert_redirected_to bet_type_url(BetType.last)
  end

  test "should show bet_type" do
    get bet_type_url(@bet_type)
    assert_response :success
  end

  test "should get edit" do
    get edit_bet_type_url(@bet_type)
    assert_response :success
  end

  test "should update bet_type" do
    patch bet_type_url(@bet_type), params: { bet_type: { code: @bet_type.code, name: @bet_type.name, odd: @bet_type.odd } }
    assert_redirected_to bet_type_url(@bet_type)
  end

  test "should destroy bet_type" do
    assert_difference('BetType.count', -1) do
      delete bet_type_url(@bet_type)
    end

    assert_redirected_to bet_types_url
  end
end

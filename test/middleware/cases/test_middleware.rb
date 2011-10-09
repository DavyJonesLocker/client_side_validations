require 'middleware/cases/helper'
require 'active_record/models/user'

class ClientSideValidationsMiddleWareTest < Test::Unit::TestCase
  def test_if_middleware_is_auto_included
    assert Rails.configuration.middleware.include?(ClientSideValidations::Middleware::Validators)
  end

  def test_scope_value_forced_to_nil_if_null
    env = {'rack.input' => String.new, 'QUERY_STRING' => 'user[email]=test@test.com&scope[parent_id]=null'}
    middleware = ClientSideValidations::Middleware::Uniqueness.new(env)
    middleware.response
    assert_nil middleware.request.params['scope']['parent_id']
  end
end


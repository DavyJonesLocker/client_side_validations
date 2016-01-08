require 'middleware/cases/helper'

class ClientSideValidationsMiddleWareTest < MiniTest::Test
  def setup
    ClientSideValidations::Config.stubs(:disabled_validators).returns([])
  end

  def test_if_middleware_is_auto_included
    assert Rails.configuration.middleware.include?(ClientSideValidations::Middleware::Validators)
  end

  def test_scope_value_forced_to_nil_if_null
    env = { 'rack.input' => '', 'QUERY_STRING' => 'user[email]=test@test.com&scope[parent_id]=null' }
    middleware = ClientSideValidations::Middleware::Uniqueness.new(env)
    middleware.response
    assert_nil middleware.request.params['scope']['parent_id']
  end

  def test_filter_out_jquery_cachebuster
    env = { 'rack.input' => '', 'QUERY_STRING' => 'user[email]=test@test.com&scope[parent_id]=null&_=123456' }
    base = ClientSideValidations::Middleware::Base.new(env)
    assert_nil base.request.params[:_]
  end

  def test_calling_on_attribute_without_uniquness_validator
    env = { 'rack.input' => '', 'QUERY_STRING' => 'user[age]=7', 'PATH_INFO' => '/validators/uniqueness' }
    app = proc { [200, {}, []] }
    response = ClientSideValidations::Middleware::Validators.new(app).call(env)
    assert_equal 500, response.first
  end

  def test_uniqueness_with_disabled
    ClientSideValidations::Config.stubs(:disabled_validators).returns([:uniqueness])
    env = { 'rack.input' => '', 'QUERY_STRING' => 'user[email]=test@test.com', 'PATH_INFO' => '/validators/uniqueness' }
    app = proc { [200, {}, []] }
    response = ClientSideValidations::Middleware::Validators.new(app).call(env)
    assert_equal 500, response.first
  end

  def test_uniqueness_with_nested_attributes
    env = { 'rack.input' => '', 'QUERY_STRING' => 'admin[user][email]=test@test.com', 'PATH_INFO' => '/validators/uniqueness' }
    app = proc { [200, {}, []] }
    response = ClientSideValidations::Middleware::Validators.new(app).call(env)
    assert_equal 404, response.first
  end
end

require 'rails'

# Pulled from railties/test/abstract_unit in Rails 3.1
module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.logger = Logger.new(STDOUT)
  end
end

require 'active_record/models/user'
require 'client_side_validations/middleware'

TestApp::Application.initialize!

class ClientSideValidationsMiddleWareTest < Test::Unit::TestCase
  def test_if_middleware_is_auto_included
    assert Rails.configuration.middleware.include?(ClientSideValidations::Middleware)
  end
end

class ClientSideValidationsActiveRecordMiddlewareTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def teardown
    User.delete_all
  end

  def app
    app = Proc.new { |env| [200, {}, ['success']] }
    ClientSideValidations::Middleware.new(app)
  end

  def test_uniqueness_when_resource_exists
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
  end

  def test_uniqueness_when_resource_exists_and_param_order_is_backwards
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'case_sensitive' => true, 'user[email]' => 'user@test.com' }

    assert_equal 'false', last_response.body
  end

  def test_uniqueness_when_resource_does_not_exist
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_id_is_given
    user = User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'id' => user.id, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_scope_is_given
    User.create(:email => 'user@test.com', :age => 25)
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'scope' => { 'age' => 30 }, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_multiple_scopes_are_given
    User.create(:email => 'user@test.com', :age => 30, :name => 'Brian')
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'scope' => { 'age' => 30, 'name' => 'Robert' }, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_case_insensitive
    User.create(:name => 'Brian')
    get '/validators/uniqueness.json', { 'user[name]' => 'BRIAN', 'case_sensitive' => false }

    assert_equal 'false', last_response.body
  end

  def test_uniqueness_when_resource_is_singular_nested
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'profile[user][email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
  end
end

class ClientSideValidationsMongoidMiddlewareTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def teardown
    Book.delete_all
  end

  def app
    app = Proc.new { |env| [200, {}, ['success']] }
    ClientSideValidations::Middleware.new(app)
  end

  def test_uniqueness_when_resource_exists
    Book.create(:author_email => 'book@test.com')
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com' }

    assert_equal 'false', last_response.body
  end

  def test_uniqueness_when_resource_does_not_exist
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com' }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_id_is_given
    book = Book.create(:author_email => 'book@test.com')
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com', 'id' => book.id }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_scope_is_given
    Book.create(:author_email => 'book@test.com', :age => 25)
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com', 'scope' => { 'age' => 30 } }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_multiple_scopes_are_given
    Book.create(:author_email => 'book@test.com', :age => 30, :author_name => 'Brian')
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com', 'scope' => { 'age' => 30, 'author_name' => 'Robert' } }

    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_case_insensitive
    Book.create(:author_name => 'Brian')
    get '/validators/uniqueness.json', { 'book[author_name]' => 'BRIAN', 'case_sensitive' => false }

    assert_equal 'false', last_response.body
  end
end


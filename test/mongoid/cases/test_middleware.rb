require 'middleware/cases/helper'
require 'mongoid/cases/helper'

class ClientSideValidationsMongoidMiddlewareTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def setup
    # I've been burned enough times with not having the db clear
    # I should probably use a db cleaner instead of this
    Book.delete_all
  end

  def teardown
    Book.delete_all
  end

  def app
    app = Proc.new { |env| [200, {}, ['success']] }
    ClientSideValidations::Middleware::Validators.new(app)
  end

  def test_uniqueness_when_resource_exists
    Book.create(:author_email => 'book@test.com')
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com' }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_does_not_exist
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com' }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_id_is_given
    book = Book.create(:author_email => 'book@test.com')
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com', 'id' => book.id }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_scope_is_given
    Book.create(:author_email => 'book@test.com', :age => 25)
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com', 'scope' => { 'age' => 30 } }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_multiple_scopes_are_given
    Book.create(:author_email => 'book@test.com', :age => 30, :author_name => 'Brian')
    get '/validators/uniqueness.json', { 'book[author_email]' => 'book@test.com', 'scope' => { 'age' => 30, 'author_name' => 'Robert' } }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_case_insensitive
    Book.create(:author_name => 'Brian')
    get '/validators/uniqueness.json', { 'book[author_name]' => 'BRIAN', 'case_sensitive' => false }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_is_a_nested_module
    MongoidTestModule::Book2.create(:author_email => 'book@test.com')
    get '/validators/uniqueness.json', { 'mongoid_test_module/book2[author_email]' => 'book@test.com' }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end
end


require 'middleware/cases/helper'
require 'mongo_mapper/cases/helper'

class ClientSideValidationsMongoMapperMiddlewareTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def setup
    # I've been burned enough times with not having the db clear
    # I should probably use a db cleaner instead of this
    Magazine.delete_all
  end

  def teardown
    Magazine.delete_all
  end

  def app
    app = Proc.new { |env| [200, {}, ['success']] }
    ClientSideValidations::Middleware::Validators.new(app)
  end

  def test_uniqueness_when_resource_exists
    Magazine.create(:author_email => 'magazine@test.com')
    get '/validators/uniqueness', { 'magazine[author_email]' => 'magazine@test.com' }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_does_not_exist
    get '/validators/uniqueness', { 'magazine[author_email]' => 'magazine@test.com' }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_id_is_given
    magazine = Magazine.create(:author_email => 'magazine@test.com')
    get '/validators/uniqueness', { 'magazine[author_email]' => 'magazine@test.com', 'id' => magazine.id }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_scope_is_given
    Magazine.create(:author_email => 'magazine@test.com', :age => 25)
    get '/validators/uniqueness', { 'magazine[author_email]' => 'magazine@test.com', 'scope' => { 'age' => 30 } }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_multiple_scopes_are_given
    Magazine.create(:author_email => 'magazine@test.com', :age => 30, :author_name => 'Brian')
    get '/validators/uniqueness', { 'magazine[author_email]' => 'magazine@test.com', 'scope' => { 'age' => 30, 'author_name' => 'Robert' } }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_case_insensitive
    Magazine.create(:author_name => 'Brian')
    get '/validators/uniqueness', { 'magazine[author_name]' => 'BRIAN', 'case_sensitive' => false }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_exists
    MongoMapperTestModule::Magazine2.create(:author_email => 'magazine@test.com')
    get '/validators/uniqueness', { 'mongo_mapper_test_module/magazine2[author_email]' => 'magazine@test.com' }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end
end


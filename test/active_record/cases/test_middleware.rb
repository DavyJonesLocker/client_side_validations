# encoding: utf-8

require 'middleware/cases/helper'
require 'active_record/cases/helper'

class ClientSideValidationsActiveRecordMiddlewareTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def teardown
    User.delete_all
  end

  def with_kcode(kcode)
    if RUBY_VERSION < '1.9'
      orig_kcode, $KCODE = $KCODE, kcode
      begin
        yield
      ensure
        $KCODE = orig_kcode
      end
    else
      yield
    end
  end

  def app
    app = Proc.new { |env| [200, {}, ['success']] }
    ClientSideValidations::Middleware.new(app)
  end

  def test_uniqueness_when_resource_exists
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_exists_and_param_order_is_backwards
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'case_sensitive' => true, 'user[email]' => 'user@test.com' }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_does_not_exist
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_id_is_given
    user = User.create(:email => 'user@test.com')
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'id' => user.id, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_scope_is_given
    User.create(:email => 'user@test.com', :age => 25)
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'scope' => { 'age' => 30 }, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_multiple_scopes_are_given
    User.create(:email => 'user@test.com', :age => 30, :name => 'Brian')
    get '/validators/uniqueness.json', { 'user[email]' => 'user@test.com', 'scope' => { 'age' => 30, 'name' => 'Robert' }, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_case_insensitive
    User.create(:name => 'Brian')
    get '/validators/uniqueness.json', { 'user[name]' => 'BRIAN', 'case_sensitive' => false }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_attribute_passes_as_an_integer
    User.create(:name => 123)
    get '/validators/uniqueness.json', { 'user[name]' => 123, 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_attribute_passes_as_an_integer
    User.create(:name => 123)
    get '/validators/uniqueness.json', { 'user[name]' => 123, 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_with_columns_which_are_sql_keywords
    Guid.validates_uniqueness_of :key
    assert_nothing_raised do
      get '/validators/uniqueness.json', { 'guid[key]' => 'test', 'case_sensitive' => true }
    end
  end

  def test_uniqueness_with_limit
    # User.title is limited to 5 characters
    User.create(:title => "abcde")
    get '/validators/uniqueness.json', { 'user[title]' => 'abcdefgh', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_with_limit_and_utf8
    with_kcode('UTF8') do
      # User.title is limited to 5 characters
      User.create(:title => "一二三四五")
      get '/validators/uniqueness.json', { 'user[title]' => '一二三四五六七八', 'case_sensitive' => true }

      assert_equal 'false', last_response.body
    assert last_response.ok?
    end
  end

  def test_validate_straight_inheritance_uniqueness
    get '/validators/uniqueness.json', { 'inept_wizard[name]' => 'Rincewind', 'case_sensitive' => true }
    assert_equal 'true', last_response.body
    assert last_response.not_found?

    IneptWizard.create(:name => 'Rincewind')
    get '/validators/uniqueness.json', { 'inept_wizard[name]' => 'Rincewind', 'case_sensitive' => true }
    assert_equal 'false', last_response.body
    assert last_response.ok?

    get '/validators/uniqueness.json', { 'conjurer[name]' => 'Rincewind', 'case_sensitive' => true }
    assert_equal 'false', last_response.body
    assert last_response.ok?

    Conjurer.create(:name => 'The Amazing Bonko')
    get '/validators/uniqueness.json', { 'thaumaturgist[name]' => 'The Amazing Bonko', 'case_sensitive' => true }
    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

end


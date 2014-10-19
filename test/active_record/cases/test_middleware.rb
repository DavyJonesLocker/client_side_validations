# encoding: utf-8

require 'middleware/cases/helper'
require 'active_record/cases/helper'

class ClientSideValidationsActiveRecordMiddlewareTest < MiniTest::Test
  include Rack::Test::Methods

  def teardown
    User.delete_all
  end

  def app
    app = Proc.new { |env| [200, {}, ['success']] }
    ClientSideValidations::Middleware::Validators.new(app)
  end

  def test_uniqueness_when_resource_exists
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness', { 'user[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_exists_and_param_order_is_backwards
    User.create(:email => 'user@test.com')
    get '/validators/uniqueness', { 'case_sensitive' => true, 'user[email]' => 'user@test.com' }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_does_not_exist
    get '/validators/uniqueness', { 'user[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_value_must_be_typecast
    User.create(:active => false)
    get '/validators/uniqueness', { 'user[active]' => 'false', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_id_is_given
    user = User.create(:email => 'user@test.com')
    get '/validators/uniqueness', { 'user[email]' => 'user@test.com', 'id' => user.id, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_mysql_adapter_uniqueness_when_id_is_given
    user = User.create(:email => 'user@test.com')
    User.connection.stubs('adapter_name').returns('Mysql2')

    sql_without_binary = "#{User.arel_table["email"].eq(user.email).to_sql} AND #{User.arel_table.primary_key.not_eq(user.id).to_sql}"
    relation = Arel::Nodes::SqlLiteral.new("BINARY #{sql_without_binary}")

    # NOTE: Stubs User#where because SQLite3 don't know BINARY
    result = User.where(sql_without_binary)
    User.expects(:where).with(relation).returns(result)

    get '/validators/uniqueness', { 'user[email]' => user.email, 'case_sensitive' => true, 'id' => user.id}
    assert_equal 'true', last_response.body
  end

  def test_mysql_adapter_uniqueness_when_id_is_given_with_scope
    user = User.create(:email => 'user@test.com', :name => 'Brian')
    User.connection.stubs('adapter_name').returns('Mysql2')

    sql_without_binary = "#{User.arel_table["email"].eq(user.email).to_sql} AND #{User.arel_table.primary_key.not_eq(user.id).to_sql} AND #{User.arel_table["name"].eq(user.name).to_sql}"
    relation = Arel::Nodes::SqlLiteral.new("BINARY #{sql_without_binary}")

    #NOTE: Stubs User#where because SQLite3 don't know BINARY
    result = User.where(sql_without_binary)
    User.expects(:where).with(relation).returns(result)

    get '/validators/uniqueness', { 'user[email]' => user.email, 'scope' => {'name' => user.name}, 'case_sensitive' => true, 'id' => user.id}
    assert_equal 'true', last_response.body
  end

  def test_uniqueness_when_scope_is_given
    User.create(:email => 'user@test.com', :age => 25)
    get '/validators/uniqueness', { 'user[email]' => 'user@test.com', 'scope' => { 'age' => 30 }, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_scope_is_given_and_value_must_be_typecast
    User.create(:email => 'user@test.com', :active => true)
    get '/validators/uniqueness', { 'user[email]' => 'user@test.com', 'scope' => { 'active' => 'true' }, 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_multiple_scopes_are_given
    User.create(:email => 'user@test.com', :age => 30, :name => 'Brian')
    get '/validators/uniqueness', { 'user[email]' => 'user@test.com', 'scope' => { 'age' => 30, 'name' => 'Robert' }, 'case_sensitive' => true }

    assert_equal 'true', last_response.body
    assert last_response.not_found?
  end

  def test_uniqueness_when_case_insensitive
    User.create(:name => 'Brian')
    get '/validators/uniqueness', { 'user[name]' => 'BRIAN', 'case_sensitive' => false }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_attribute_passes_as_an_integer
    User.create(:name => 123)
    get '/validators/uniqueness', { 'user[name]' => 123, 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_attribute_passes_as_an_integer
    User.create(:name => 123)
    get '/validators/uniqueness', { 'user[name]' => 123, 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_with_columns_which_are_sql_keywords
    Guid.validates_uniqueness_of :key
    get '/validators/uniqueness', { 'guid[key]' => 'test', 'case_sensitive' => true }
  end

  def test_uniqueness_with_limit
    # User.title is limited to 5 characters
    User.create(:title => "abcde")
    get '/validators/uniqueness', { 'user[title]' => 'abcdefgh', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_with_limit_and_utf8
    # User.title is limited to 5 characters
    User.create(:title => "一二三四五")
    get '/validators/uniqueness', { 'user[title]' => '一二三四五六七八', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_validate_straight_inheritance_uniqueness
    get '/validators/uniqueness', { 'inept_wizard[name]' => 'Rincewind', 'case_sensitive' => true }
    assert_equal 'true', last_response.body
    assert last_response.not_found?

    IneptWizard.create(:name => 'Rincewind')
    get '/validators/uniqueness', { 'inept_wizard[name]' => 'Rincewind', 'case_sensitive' => true }
    assert_equal 'false', last_response.body
    assert last_response.ok?

    get '/validators/uniqueness', { 'conjurer[name]' => 'Rincewind', 'case_sensitive' => true }
    assert_equal 'false', last_response.body
    assert last_response.ok?

    Conjurer.create(:name => 'The Amazing Bonko')
    get '/validators/uniqueness', { 'thaumaturgist[name]' => 'The Amazing Bonko', 'case_sensitive' => true }
    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_is_a_nested_module
    ActiveRecordTestModule::User2.create(:email => 'user@test.com')
    get '/validators/uniqueness', { 'active_record_test_module/user2[email]' => 'user@test.com', 'case_sensitive' => true }

    assert_equal 'false', last_response.body
    assert last_response.ok?
  end

  def test_uniqueness_when_resource_descends_from_an_abstract_base_class
      Thing.create(:name => 'name_to_be_duplicated')
      get '/validators/uniqueness', { 'thing[name]' => 'name_to_be_duplicated', 'case_sensitive' => true }

      assert_equal 'false', last_response.body
      assert last_response.ok?
  end

end

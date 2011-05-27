require 'mongo_mapper/cases/test_base'

class MongoMapper::UniqunessValidatorTest < ClientSideValidations::MongoMapperTestBase

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "has already been taken" }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@magazine, :age)
  end

  def test_uniqueness_client_side_hash_with_custom_message
    expected_hash = { :message => "is not available" ,  :case_sensitive => true  }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name], :message => "is not available").client_side_hash(@magazine, :age)
  end

  def test_uniqueness_client_side_hash
    @magazine.stubs(:new_record?).returns(false)
    @magazine.stubs(:id).returns(1)
    expected_hash = { :message => "has already been taken", :case_sensitive => true , :id => 1 }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@magazine, :age)
  end

  def test_uniqueness_client_side_hash_with_single_scope_item
    @magazine.stubs(:author_email).returns("test@test.com")
    expected_hash = { :message => "has already been taken",  :case_sensitive => true , :scope => {:author_email => "test@test.com"} }
    result_hash = UniquenessValidator.new(:attributes => [:author_name], :scope => :author_email).client_side_hash(@magazine, :author_name)
    assert_equal expected_hash, result_hash
  end

  def test_uniqueness_client_side_hash_with_multiple_scope_items
    @magazine.stubs(:age).returns(30)
    @magazine.stubs(:author_email).returns("test@test.com")
    expected_hash = { :message => "has already been taken",  :case_sensitive => true , :scope => {:age => 30, :author_email => "test@test.com"} }
    result_hash = UniquenessValidator.new(:attributes => [:author_name], :scope => [:age, :author_email]).client_side_hash(@magazine, :author_name)
    assert_equal expected_hash, result_hash
  end

  def test_uniqueness_client_side_hash_with_empty_scope_array
    expected_hash = { :message => "has already been taken"  , :case_sensitive => true }
    result_hash = UniquenessValidator.new(:attributes => [:author_name], :scope => []).client_side_hash(@magazine, :author_name)
    assert_equal expected_hash, result_hash
  end

  def test_uniqueness_client_side_hash_when_nested_module
    @magazine = MongoMapperTestModule::Magazine2.new
    expected_hash = { :message => "has already been taken", :case_sensitive => true, :class => 'mongo_mapper_test_module/magazine2' }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@magazine, :age)
  end

end


require 'mongomapper/cases/test_base'

class MongoMapper::UniqunessValidatorTest < ClientSideValidations::MongoMapperTestBase

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "is already taken" }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@book, :age)
  end

  def test_uniqueness_client_side_hash_with_custom_message
    expected_hash = { :message => "is not available" }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name], :message => "is not available").client_side_hash(@book, :age)
  end

  def test_uniqueness_client_side_hash
    @book.stubs(:new_record?).returns(false)
    @book.stubs(:id).returns(1)
    expected_hash = { :message => "is already taken", :id => 1 }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@book, :age)
  end

  def test_uniqueness_client_side_hash_with_single_scope_item
    @book.stubs(:author_email).returns("test@test.com")
    expected_hash = { :message => "is already taken", :scope => {:author_email => "test@test.com"} }
    result_hash = UniquenessValidator.new(:attributes => [:author_name], :scope => :author_email).client_side_hash(@book, :author_name)
    assert_equal expected_hash, result_hash
  end

  def test_uniqueness_client_side_hash_with_multiple_scope_items
    @book.stubs(:age).returns(30)
    @book.stubs(:author_email).returns("test@test.com")
    expected_hash = { :message => "is already taken", :scope => {:age => 30, :author_email => "test@test.com"} }
    result_hash = UniquenessValidator.new(:attributes => [:author_name], :scope => [:age, :author_email]).client_side_hash(@book, :author_name)
    assert_equal expected_hash, result_hash
  end

  def test_uniqueness_client_side_hash_with_empty_scope_array
    expected_hash = { :message => "is already taken" }
    result_hash = UniquenessValidator.new(:attributes => [:author_name], :scope => []).client_side_hash(@book, :author_name)
    assert_equal expected_hash, result_hash
  end

end


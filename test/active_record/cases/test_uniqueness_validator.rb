require 'active_record/cases/test_base'

class ActiveRecord::UniquenessValidatorTest < ClientSideValidations::ActiveRecordTestBase

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "has already been taken", :case_sensitive => true }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@user, :name)
  end

  def test_uniqueness_client_side_hash_with_custom_message
    expected_hash = { :message => "is not available", :case_sensitive => true }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name], :message => "is not available").client_side_hash(@user, :name)
  end

  def test_uniqueness_client_side_hash
    @user.stubs(:new_record?).returns(false)
    @user.stubs(:id).returns(1)
    expected_hash = { :message => "has already been taken", :case_sensitive => true, :id => 1 }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@user, :name)
  end

  def test_uniqueness_client_side_hash_with_scope
    @user.stubs(:age).returns(30)
    @user.stubs(:title).returns("test title")
    expected_hash = { :message => "has already been taken", :case_sensitive => true, :scope => {:age => 30, :title => "test title"} }
    result_hash = UniquenessValidator.new(:attributes => [:name], :scope => [:age, :title]).client_side_hash(@user, :name)
    assert_equal expected_hash, result_hash
  end

end


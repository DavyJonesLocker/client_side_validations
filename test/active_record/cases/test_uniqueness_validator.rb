require 'active_record/cases/test_base'

class ActiveRecord::UniquenessValidatorTest < ClientSideValidations::ActiveRecordTestBase

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "has already been taken", :case_sensitive => true }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@user, :age)
  end

  def test_uniqueness_client_side_hash_with_custom_message
    expected_hash = { :message => "is not available", :case_sensitive => true }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name], :message => "is not available").client_side_hash(@user, :age)
  end

end


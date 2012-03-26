require 'active_model/cases/test_base'

class ActiveModel::FormatValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_format_client_side_hash
    expected_hash = { :message => "is invalid", :with => /.+/ }
    assert_equal expected_hash, FormatValidator.new(:attributes => [:name], :with => /.+/).client_side_hash(@person, :age)
  end

  def test_format_client_side_hash_without
    expected_hash = { :message => "is invalid", :without => /.+/ }
    assert_equal expected_hash, FormatValidator.new(:attributes => [:name], :without => /.+/).client_side_hash(@person, :age)
  end

  def test_format_client_side_hash_with_custom_message
    expected_hash = { :message => "is wrong format", :with => /.+/ }
    assert_equal expected_hash, FormatValidator.new(:attributes => [:name], :with => /.+/, :message => "is wrong format").client_side_hash(@person, :age)
  end

  def test_format_client_side_hash_set_with_proc
    expected_hash = { :message => "is invalid", :with => /.+/ }
    assert_equal expected_hash, FormatValidator.new(:attributes => [:name], :with => Proc.new { |m| /.+/ }).client_side_hash(@person, :age)
  end
end


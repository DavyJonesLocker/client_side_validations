require 'active_model/cases/test_base'

class ActiveModel::ConfirmationValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_confirmation_client_side_hash
    expected_hash = { :message => "doesn't match confirmation" }
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

  def test_confirmation_client_side_hash_with_custom_message
    expected_hash = { :message => "you must confirm" }
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name], :message => "you must confirm").client_side_hash(@person, :age)
  end

  def test_confirmation_client_side_hash_custom_message_set_with_proc
    expected_hash = { :message => "you must confirm" }
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name], :message => Proc.new { |m| "you must confirm" }).client_side_hash(@person, :age)
  end


end


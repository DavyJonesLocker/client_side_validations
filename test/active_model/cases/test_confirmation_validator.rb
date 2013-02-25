require 'active_model/cases/test_base'

class ActiveModel::ConfirmationValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_confirmation_client_side_hash
    if Rails.version < '4.0.0'
      expected_hash = { :message => "doesn't match confirmation" }
    else
      expected_hash = { :message => "doesn't match Age" }
    end
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

  def test_confirmation_client_side_hash_with_custom_message
    expected_hash = { :message => "you must confirm" }
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name], :message => "you must confirm").client_side_hash(@person, :age)
  end

end


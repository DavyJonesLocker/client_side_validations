require 'active_model/cases/test_base'

class ActiveModel::ConfirmationValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_confirmation_client_side_hash
    expected_hash = { :message => "doesn't match confirmation" }
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

end


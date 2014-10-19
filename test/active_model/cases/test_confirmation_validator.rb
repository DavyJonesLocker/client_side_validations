require 'active_model/cases/test_base'

class ActiveModel::ConfirmationValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_confirmation_client_side_hash
    expected_hash = { message: "doesn't match Age" }
    if Rails.version.starts_with?('4.0')
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name]).client_side_hash(@person, :age)
    else
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name], class: Person).client_side_hash(@person, :age)
    end
  end

  def test_confirmation_client_side_hash_with_custom_message
    expected_hash = { message: "you must confirm" }
    if Rails.version.starts_with?('4.0')
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name], message: "you must confirm").client_side_hash(@person, :age)
    else
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name], class: Person, message: "you must confirm").client_side_hash(@person, :age)
    end
  end

end

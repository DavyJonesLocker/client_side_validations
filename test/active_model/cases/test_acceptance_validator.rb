require 'active_model/cases/test_base'

class ActiveModel::AcceptanceValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_acceptance_client_side_hash
    expected_hash = { message: "must be accepted", accept: "1" }
    if Rails.version.starts_with?('4.0')
      assert_equal expected_hash, AcceptanceValidator.new(attributes: [:name]).client_side_hash(@person, :age)
    else
      assert_equal expected_hash, AcceptanceValidator.new(attributes: [:name], class: Person).client_side_hash(@person, :age)
    end
  end

  def test_acceptance_client_side_hash_with_custom_message
    expected_hash = { message: "you must accept", accept: "1" }
    if Rails.version.starts_with?('4.0')
      assert_equal expected_hash, AcceptanceValidator.new(attributes: [:name], message: "you must accept").client_side_hash(@person, :age)
    else
      assert_equal expected_hash, AcceptanceValidator.new(attributes: [:name], class: Person, message: "you must accept").client_side_hash(@person, :age)
    end
  end

end

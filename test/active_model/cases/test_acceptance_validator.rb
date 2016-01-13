require 'active_model/cases/test_base'

module ActiveModel
  class AcceptanceValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_acceptance_client_side_hash
      expected_hash = { message: 'must be accepted', accept: ['1', true] }
      assert_equal expected_hash, AcceptanceValidator.new(attributes: [:name], class: Person).client_side_hash(@person, :age)
    end

    def test_acceptance_client_side_hash_with_custom_message
      expected_hash = { message: 'you must accept', accept: ['1', true] }
      assert_equal expected_hash, AcceptanceValidator.new(attributes: [:name], class: Person, message: 'you must accept').client_side_hash(@person, :age)
    end
  end
end

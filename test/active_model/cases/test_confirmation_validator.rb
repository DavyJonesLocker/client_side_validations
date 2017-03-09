# frozen_string_literal: true
require 'active_model/cases/test_base'

module ActiveModel
  class ConfirmationValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_confirmation_client_side_hash
      expected_hash = { message: "doesn't match Age", case_sensitive: true }
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name], class: Person).client_side_hash(@person, :age)
    end

    def test_confirmation_client_side_without_case_sensitive
      expected_hash = { message: "doesn't match Age", case_sensitive: false }
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name], class: Person, case_sensitive: false).client_side_hash(@person, :age)
    end

    def test_confirmation_client_side_hash_with_custom_message
      expected_hash = { message: 'you must confirm', case_sensitive: true }
      assert_equal expected_hash, ConfirmationValidator.new(attributes: [:name], class: Person, message: 'you must confirm').client_side_hash(@person, :age)
    end
  end
end

# frozen_string_literal: true

require 'active_model/cases/test_base'

module ActiveModel
  class AbsenceValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_absence_client_side_hash
      expected_hash = { message: 'must be blank' }

      assert_equal expected_hash, AbsenceValidator.new(attributes: [:first_name]).client_side_hash(@person, :first_name)
    end

    def test_absence_client_side_hash_with_custom_message
      expected_hash = { message: 'is required to be blank' }

      assert_equal expected_hash, AbsenceValidator.new(attributes: [:first_name], message: 'is required to be blank').client_side_hash(@person, :first_name)
    end
  end
end

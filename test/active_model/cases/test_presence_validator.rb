# frozen_string_literal: true

require 'active_model/cases/test_base'

module ActiveModel
  class PresenceValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_presence_client_side_hash
      expected_hash = { message: I18n.t('errors.messages.blank') }

      assert_equal expected_hash, PresenceValidator.new(attributes: [:first_name]).client_side_hash(@person, :first_name)
    end

    def test_presence_client_side_hash_with_custom_message
      expected_hash = { message: 'is required' }

      assert_equal expected_hash, PresenceValidator.new(attributes: [:first_name], message: 'is required').client_side_hash(@person, :first_name)
    end
  end
end

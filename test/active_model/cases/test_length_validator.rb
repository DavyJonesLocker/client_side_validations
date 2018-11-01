# frozen_string_literal: true

require 'active_model/cases/test_base'

module ActiveModel
  class LengthValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_length_client_side_hash
      expected_hash = {
        messages: {
          is: 'is the wrong length (should be 10 characters)'
        },
        is:       10
      }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], is: 10).client_side_hash(@person, :first_name)
    end

    def test_length_client_side_hash_with_allow_nil
      expected_hash = { messages: { is: 'is the wrong length (should be 10 characters)' }, is: 10, allow_blank: true }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], is: 10, allow_nil: true).client_side_hash(@person, :age)
    end

    def test_length_client_side_hash_with_custom_message
      expected_hash = {
        messages: {
          is: 'is the wrong length (should be 10 words)'
        },
        is:       10
      }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], is: 10, wrong_length: 'is the wrong length (should be %{count} words)').client_side_hash(@person, :first_name)
    end

    def test_length_client_side_hash_with_custom_general_message
      expected_hash = {
        messages: {
          minimum: 'is not the correct length',
          maximum: 'is way too long'
        },
        minimum:  4,
        maximum:  10
      }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], minimum: 4, maximum: 10, message: 'is not the correct length', too_long: 'is way too long').client_side_hash(@person, :first_name)
    end

    def test_length_client_side_hash_with_js_tokenizer
      expected_hash = {
        messages:     {
          is: 'is the wrong length (should be 10 characters)'
        },
        is:           10,
        js_tokenizer: 'match(/\w+/g)'
      }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], is: 10, tokenizer: proc { |value| value.split(/\w+/) }, js_tokenizer: 'match(/\w+/g)').client_side_hash(@person, :first_name)
    end

    def test_length_client_side_hash_with_minimum_and_maximum
      expected_hash = {
        messages: {
          minimum: 'is too short (minimum is 5 characters)',
          maximum: 'is too long (maximum is 10 characters)'
        },
        minimum:  5,
        maximum:  10
      }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], minimum: 5, maximum: 10).client_side_hash(@person, :first_name)
    end

    def test_length_client_side_hash_with_range
      expected_hash = {
        messages: {
          minimum: 'is too short (minimum is 5 characters)',
          maximum: 'is too long (maximum is 10 characters)'
        },
        minimum:  5,
        maximum:  10
      }
      assert_equal expected_hash, LengthValidator.new(attributes: [:age], within: 5..10).client_side_hash(@person, :first_name)
    end
  end
end

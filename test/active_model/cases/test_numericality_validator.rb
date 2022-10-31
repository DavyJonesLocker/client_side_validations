# frozen_string_literal: true

require 'active_model/cases/test_base'

module ActiveModel
  class NumericalityValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_numericality_client_side_hash
      expected_hash = { messages: { numericality: 'is not a number' } }

      assert_equal expected_hash, NumericalityValidator.new(attributes: [:age]).client_side_hash(@person, :age)
    end

    def test_numericality_client_side_hash_with_allow_nil
      expected_hash = { messages: { numericality: 'is not a number' }, allow_blank: true }

      assert_equal expected_hash, NumericalityValidator.new(attributes: [:age], allow_nil: true).client_side_hash(@person, :age)
    end

    def test_numericality_client_side_hash_with_custom_message
      expected_hash = { messages: { numericality: 'bad number' } }

      assert_equal expected_hash, NumericalityValidator.new(attributes: [:age], message: 'bad number').client_side_hash(@person, :age)
    end

    def test_numericality_client_side_hash_with_options
      expected_hash = {
        messages:                 {
          numericality:             'is not a number',
          only_integer:             'must be an integer',
          greater_than:             'must be greater than 10',
          greater_than_or_equal_to: 'must be greater than or equal to 10',
          equal_to:                 'must be equal to 10',
          less_than:                'must be less than 10',
          less_than_or_equal_to:    'must be less than or equal to 10',
          odd:                      'must be odd',
          even:                     'must be even'
        },
        only_integer:             true,
        greater_than:             10,
        greater_than_or_equal_to: 10,
        equal_to:                 10,
        less_than:                10,
        less_than_or_equal_to:    10,
        odd:                      true,
        even:                     true
      }
      test_hash = NumericalityValidator.new(attributes: [:age],
                                            only_integer: true, greater_than: 10, greater_than_or_equal_to: 10,
                                            equal_to: 10, less_than: 10, less_than_or_equal_to: 10,
                                            odd: true, even: true).client_side_hash(@person, :age)

      assert_equal expected_hash, test_hash
    end

    def test_numericality_message_always_present
      expected_hash = { messages: { numericality: 'is not a number', only_integer: 'must be an integer' }, only_integer: true }

      assert_equal expected_hash, NumericalityValidator.new(attributes: [:age], only_integer: true).client_side_hash(@person, :age)
    end

    def test_numericality_client_side_hash_ignore_proc
      @person.stubs(:years).returns(5)
      expected_hash = { messages: { numericality: 'is not a number' } }

      assert_equal expected_hash, NumericalityValidator.new(attributes: [:age], equal_to: proc { |o| o.years }).client_side_hash(@person, :age)
    end

    def test_numericality_client_side_hash_observe_proc
      @person.stubs(:years).returns(5)
      expected_hash = { messages: { numericality: 'is not a number', equal_to: 'must be equal to 5' }, equal_to: 5 }

      assert_equal expected_hash, NumericalityValidator.new(attributes: [:age], equal_to: proc { |o| o.years }).client_side_hash(@person, :age, true)
    end
  end
end

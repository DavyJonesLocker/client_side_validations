require 'active_model/cases/test_base'

module ActiveModel
  class InclusionValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_inclusion_client_side_hash
      expected_hash = { message: 'is not included in the list', in: [1, 2] }
      assert_equal expected_hash, InclusionValidator.new(attributes: [:name], in: [1, 2]).client_side_hash(@person, :age)
    end

    def test_inclusion_client_side_hash_with_custom_message
      expected_hash = { message: 'is not a choice', in: [1, 2] }
      assert_equal expected_hash, InclusionValidator.new(attributes: [:name], in: [1, 2], message: 'is not a choice').client_side_hash(@person, :age)
    end

    def test_inclusion_client_side_hash_with_range
      expected_hash = { message: 'is not included in the list', range: 1..2 }
      assert_equal expected_hash, InclusionValidator.new(attributes: [:name], in: 1..2).client_side_hash(@person, :age)
    end

    def test_inclusion_client_side_hash_ignore_proc
      @person.stubs(:range).returns([1, 2])
      assert_nil InclusionValidator.new(attributes: [:name], in: proc { |o| o.range }).client_side_hash(@person, :age)
    end

    def test_inclusion_client_side_hash_observe_proc
      @person.stubs(:range).returns([1, 2])
      expected_hash = { message: 'is not included in the list', in: [1, 2] }
      assert_equal expected_hash, InclusionValidator.new(attributes: [:name], in: proc { |o| o.range }).client_side_hash(@person, :age, true)
    end
  end
end

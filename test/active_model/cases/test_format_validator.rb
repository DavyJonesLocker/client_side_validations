require 'active_model/cases/test_base'

module ActiveModel
  class FormatValidatorTest < ClientSideValidations::ActiveModelTestBase
    def test_format_client_side_hash
      expected_hash = { message: 'is invalid', with: /.+/ }
      assert_equal expected_hash, FormatValidator.new(attributes: [:name], with: /.+/).client_side_hash(@person, :age)
    end

    def test_format_client_side_hash_without
      expected_hash = { message: 'is invalid', without: /.+/ }
      assert_equal expected_hash, FormatValidator.new(attributes: [:name], without: /.+/).client_side_hash(@person, :age)
    end

    def test_format_client_side_hash_with_custom_message
      expected_hash = { message: 'is wrong format', with: /.+/ }
      assert_equal expected_hash, FormatValidator.new(attributes: [:name], with: /.+/, message: 'is wrong format').client_side_hash(@person, :age)
    end

    def test_format_client_side_hash_ignore_proc
      @person.stubs(:matcher).returns(/.+/)
      assert_nil FormatValidator.new(attributes: [:name], with: proc { |o| o.matcher }).client_side_hash(@person, :age)
    end

    def test_format_client_side_hash_without_ignore_proc
      @person.stubs(:matcher).returns(/.+/)
      assert_nil FormatValidator.new(attributes: [:name], without: proc { |o| o.matcher }).client_side_hash(@person, :age)
    end

    def test_format_client_side_hash_observe_proc
      @person.stubs(:matcher).returns(/.+/)
      expected_hash = { message: 'is invalid', with: /.+/ }
      assert_equal expected_hash, FormatValidator.new(attributes: [:name], with: proc { |o| o.matcher }).client_side_hash(@person, :age, true)
    end

    def test_format_client_side_hash_without_observe_proc
      @person.stubs(:matcher).returns(/.+/)
      expected_hash = { message: 'is invalid', without: /.+/ }
      assert_equal expected_hash, FormatValidator.new(attributes: [:name], without: proc { |o| o.matcher }).client_side_hash(@person, :age, true)
    end
  end
end

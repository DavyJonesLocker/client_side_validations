require 'base_helper'
require 'client_side_validations/core_ext'

class CoreExtTest < Test::Unit::TestCase
  def test_regexp_as_json
    regexp = //
    assert_equal regexp, regexp.as_json
  end

  def test_regexp_replace_A_and_Z
    test_regexp = /\A\Z/
    expected_regexp = /^$/
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_replace_a_and_z
    test_regexp = /\A\z/
    expected_regexp = /^$/
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_to_json
    assert_equal "/^$/", /\A\Z/.to_json(nil)
  end

  def test_regexp_encode_json
    assert_equal "//", //.encode_json(nil)
  end

  def test_regexp_as_jason_with_options
    assert_equal //i, //i.as_json
  end

  def test_range_as_json
    assert_equal [1,3], (1..3).as_json
  end

  def test_range_to_json
    assert_equal '[1, 3]', (1..3).to_json(nil)
  end

  def test_range_as_json_with_floats
    assert_equal [0.5,5.5], (0.5..5.5).as_json
  end
end


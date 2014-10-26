require 'base_helper'
require 'client_side_validations/core_ext'

class CoreExtTest < MiniTest::Test
  def test_regexp_replace_A_and_Z
    test_regexp = /\A\Z/
    expected_regexp = { source: '^$', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_replace_a_and_z
    test_regexp = /\A\z/
    expected_regexp = { source: '^$', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_to_json
    expected_regexp = { source: '^$', options: '' }
    assert_equal expected_regexp, /\A\Z/.to_json(nil)
  end

  def test_regexp_in_hash_to_json
    expected_regexp = { hello: { source: 'world', options: 'i' } }
    hash = { hello: /world/i }
    assert_equal expected_regexp.to_json, hash.to_json
  end

  def test_regexp_encode_json
    assert_equal "//", //.encode_json(nil)
  end

  def test_regexp_remove_comment
    expected_regexp = { source: '', options: '' }
    assert_equal expected_regexp, /(?# comment)/.to_json(nil)
  end

  def test_regexp_remove_group_options
    expected_regexp = { source: '(something)', options: '' }
    assert_equal expected_regexp, /(?-mix:something)/.to_json(nil)
  end

  def test_regexp_as_json_with_options
    expected_regexp = { source: '', options: 'i' }
    assert_equal expected_regexp, //i.as_json
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

  def test_multiline_regexp_as_json
    test_regexp = /
    /
    expected_regexp = { source: '', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_modifiers_as_json
    # JS allows /i and /m modifiers, all other lead to error
    assert_equal(({ source: '', options: 'i' }), //i.as_json)
    assert_equal(({ source: '', options: 'm' }), //m.as_json)
    assert_equal(({ source: '', options: 'im' }), //im.as_json)
    assert_equal(({ source: '', options: '' }), //x.as_json)
    assert_equal(({ source: '', options: 'i' }), //ix.as_json)
  end

end

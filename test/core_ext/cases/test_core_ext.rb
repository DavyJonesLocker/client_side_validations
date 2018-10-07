# frozen_string_literal: true

require 'base_helper'
require 'client_side_validations/core_ext'

class CoreExtTest < MiniTest::Test
  def test_regexp_replace_uppercase_a_and_uppercase_z
    test_regexp = /\A\Z/
    # \Z allows optional newline before end of string
    expected_regexp = { source: '^(?=\\n?$)', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_replace_uppercase_a_and_lowercase_z
    test_regexp = /\A\z/
    expected_regexp = { source: '^$', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_to_json
    expected_regexp = { source: '^$', options: '' }
    assert_equal expected_regexp, /\A\z/.to_json
  end

  def test_regexp_in_hash_to_json
    expected_regexp = { hello: { source: 'world', options: 'i' } }
    hash = { hello: /world/i }
    assert_equal expected_regexp.to_json, hash.to_json
  end

  def test_regexp_encode_json
    assert_equal '//', //.encode_json(nil)
  end

  def test_regexp_remove_comment
    expected_regexp = { source: '', options: '' }
    assert_equal expected_regexp, /(?# comment)/.to_json
  end

  def test_regexp_convert_group_options
    expected_regexp = { source: '(?:something)', options: '' }
    assert_equal expected_regexp, /(?-mix:something)/.to_json
  end

  def test_regexp_as_json_with_options
    expected_regexp = { source: '', options: 'i' }
    assert_equal expected_regexp, //i.as_json
  end

  def test_range_as_json
    assert_equal [1, 3], (1..3).as_json
  end

  def test_range_to_json
    assert_equal '[1, 3]', (1..3).to_json
  end

  def test_range_as_json_with_floats
    assert_equal [0.5, 5.5], (0.5..5.5).as_json
  end

  def test_multiline_regexp_as_json
    # A regexp with a line break in it WILL match line breaks in Ruby
    # if the extended option /x is not set. It WILL also match any
    # spaces with which the line that follows the line break is indented.
    test_regexp = /
/
    expected_regexp = { source: '\\n', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_with_literal_whitespace_as_json
    # regression test for issue #460
    test_regexp = / /
    expected_regexp = { source: ' ', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_with_unicode_properties_as_json
    # regression test for issue #615
    # The double backslashes are needed by JS' new RegExp() constructor.
    test_regexp = /\p{ASCII}/
    expected_regexp = { source: '[\\x00-\\x7F]', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_extended_mode_regexp_with_escaped_whitespace_as_json
    # regression test for issue #625
    test_regexp = /    [\ a]\    /x
    expected_regexp = { source: '[\\x20a]\\ ', options: '' }
    assert_equal expected_regexp, test_regexp.as_json
  end

  def test_regexp_modifiers_as_json
    # - JS has the same /i option as Ruby, so this should be transferred.
    # - /m in JS has nothing to do with /m in Ruby. Ruby's /m can only be
    #   achieved in JS by modifying the source, not by setting /m.
    assert_equal({ source: '', options: 'i' }, //i.as_json)
    assert_equal({ source: '', options: 'i' }, //im.as_json)
    assert_equal({ source: '', options: 'i' }, //ix.as_json)
    assert_equal({ source: '', options: ''  }, //m.as_json)
    assert_equal({ source: '', options: ''  }, //x.as_json)
  end
end

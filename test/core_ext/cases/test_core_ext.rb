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

  def test_regexp_to_json
    assert_equal "//", //.to_json
  end

  def test_regexp_encode_json
    assert_equal //.inspect, //.encode_json(nil)
  end

  def test_regexp_as_jason_with_options
    assert_equal //i, //i.as_json
  end
end


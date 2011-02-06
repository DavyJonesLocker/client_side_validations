require 'client_side_validations/core_ext'

class CoreExtTest < Test::Unit::TestCase
  def test_regular_expressions_as_json
    regexp = //
    assert_equal regexp.inspect, regexp.as_json
  end
end


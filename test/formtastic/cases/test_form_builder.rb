require 'formtastic/cases/helper'

class ClientSideValidations::Formtastic::SemanticFormBuilderTest < Test::Unit::TestCase
  def test_client_side_form_js_hash
    expected = {
      :type => 'Formtastic::SemanticFormBuilder',
      :inline_error_class => 'inline-errors'
    }
    assert_equal expected, Formtastic::SemanticFormBuilder.client_side_form_js_hash(nil, nil)
  end
end

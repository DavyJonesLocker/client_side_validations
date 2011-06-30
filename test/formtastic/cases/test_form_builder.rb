require 'formtastic/cases/helper'

class ClientSideValidations::Formtastic::FormBuilderTest < Test::Unit::TestCase
  def test_client_side_form_js_hash
    expected = {
      :type => 'Formtastic::FormBuilder',
      :inline_error_class => 'inline-errors'
    }
    assert_equal expected, Formtastic::FormBuilder.client_side_form_settings(nil, nil)
  end
end

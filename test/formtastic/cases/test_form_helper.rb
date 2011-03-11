require 'action_view/cases/helper'
require 'formtastic/cases/helper'

class ClientSideValidations::Formtastic::FormHelperTest < ActionView::TestCase
  include ActionViewTestSetup
  include Formtastic::SemanticFormHelper

  def client_side_form_js_variable_helper
    ""
  end

  def test_semantic_form_for
    semantic_form_for(@post, :validate => true) do |f|
      concat f.input(:cost)
    end

    expected = %{<form accept-charset="UTF-8" action="/posts/123" class="formtastic post" data-validate="true" id="edit_post_123" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="_method" type="hidden" value="put" /></div><li class="string required" id="post_cost_input"><label for="post_cost">Cost<abbr title="required">*</abbr></label><input data-validators="{&quot;presence&quot;:{&quot;message&quot;:&quot;can't be blank&quot;}}" id="post_cost" name="post[cost]" type="text" /></li></form><script>var edit_post_123 = {"type":"Formtastic::SemanticFormBuilder","inline_error_class":"inline-errors"};</script>}
    assert_equal expected, output_buffer
  end

end


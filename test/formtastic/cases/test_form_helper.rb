require 'action_view/cases/helper'
require 'formtastic/cases/helper'

class ClientSideValidations::Formtastic::FormHelperTest < ActionView::TestCase
  include ActionViewTestSetup
  include Formtastic::Helpers::FormHelper

  def client_side_form_settings_helper
    ""
  end

  def test_semantic_form_for
    semantic_form_for(@post, :validate => true) do |f|
      concat f.input(:cost)
    end

    expected = %{<form accept-charset="UTF-8" action="/posts/123" class="formtastic post" data-validate="true" id="edit_post_123" method="post" novalidate="novalidate"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="_method" type="hidden" value="put" /></div><li class="string input required stringish" id="post_cost_input"><label class=\" label\" for="post_cost">Cost<abbr title="required">*</abbr></label><input data-validate="true" id="post_cost" name="post[cost]" type="text" />\n\n</li></form><script>window['edit_post_123'] = {"type":"Formtastic::FormBuilder","inline_error_class":"inline-errors","validators":{"post[cost]":{"presence":{"message":"can't be blank"}}}};</script>}
    assert_equal expected, output_buffer, "\n\n *** If you're running Ruby 1.8 and this test fails is is most likely due to 1.8's lack of insertion order persistence with Hashes ***\n"
  end

end

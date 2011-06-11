require 'action_view/cases/helper'
require 'middleware/cases/helper'
require 'simple_form/cases/helper'

class ClientSideValidations::SimpleForm::FormHelperTest < ActionView::TestCase
  include ActionViewTestSetup
  include SimpleForm::ActionViewExtensions::FormHelper

  def client_side_form_settings_helper
    ""
  end

  def test_simple_form_for
    ActionView::TestCase::TestController.any_instance.stubs(:action_name).returns('edit')
    simple_form_for(@post, :validate => true) do |f|
      concat f.input(:cost)
    end

    expected = %{<form accept-charset="UTF-8" action="/posts/123" class="simple_form post" data-validate="true" id="edit_post_123" method="post" novalidate="novalidate"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="_method" type="hidden" value="put" /></div><div class="input string required"><label class="string required" for="post_cost"><abbr title="required">*</abbr> Cost</label><input class="string required" data-validate="true" id="post_cost" name="post[cost]" required="required" size="50" type="text" /></div></form><script>window['edit_post_123'] = {"type":"SimpleForm::FormBuilder","error_class":"error","error_tag":"span","wrapper_error_class":"field_with_errors","wrapper_tag":"div","validators":{"post[cost]":{"presence":{"message":"can't be blank"}}}};</script>}
    assert_equal expected, output_buffer, "\n\n *** If you're running Ruby 1.8 and this test fails is is most likely due to 1.8's lack of insertion order persistence with Hashes ***\n"
  end

end


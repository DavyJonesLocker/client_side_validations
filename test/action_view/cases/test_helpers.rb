require 'action_view/cases/helper'

class ClientSideValidations::ActionViewHelpersTest < ActionView::TestCase
  include ActionViewTestSetup

  cattr_accessor :field_error_proc
  @@field_error_proc = Proc.new { |html_tag, instance| html_tag }

  def client_side_form_settings_helper
    {
      :type => "ActionView::Helpers::FormBuilder",
      :input_tag => %{<span id="input_tag" />},
      :label_tag => %{<label id="label_tag" />}
    }
  end

  def test_text_field
    form_for(@post, :validate => true) do |f|
      concat f.text_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_password_field
    form_for(@post, :validate => true) do |f|
      concat f.password_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="password" />}
    end
    assert_equal expected, output_buffer
  end

  def test_file_field
    form_for(@post, :validate => true) do |f|
      concat f.file_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" type="file" />}
    end
    assert_equal expected, output_buffer
  end

  def test_text_area
    form_for(@post, :validate => true) do |f|
      concat f.text_area(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<textarea cols="40" data-validate="true" id="post_cost" name="post[cost]" rows="20"></textarea>}
    end
    assert_equal expected, output_buffer
  end

  def test_search_field
    form_for(@post, :validate => true) do |f|
      concat f.search_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="search" />}
    end
    assert_equal expected, output_buffer
  end

  def test_telephone_field
    form_for(@post, :validate => true) do |f|
      concat f.telephone_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="tel" />}
    end
    assert_equal expected, output_buffer
  end

  def test_phone_field
    form_for(@post, :validate => true) do |f|
      concat f.phone_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="tel" />}
    end
    assert_equal expected, output_buffer
  end

  def test_url_field
    form_for(@post, :validate => true) do |f|
      concat f.url_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="url" />}
    end
    assert_equal expected, output_buffer
  end

  def test_email_field
    form_for(@post, :validate => true) do |f|
      concat f.email_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="email" />}
    end
    assert_equal expected, output_buffer
  end

  def test_number_field
    form_for(@post, :validate => true) do |f|
      concat f.number_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="number" />}
    end
    assert_equal expected, output_buffer
  end

  def test_range_field
    form_for(@post, :validate => true) do |f|
      concat f.range_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="range" />}
    end
    assert_equal expected, output_buffer
  end

  def test_check_box
    form_for(@post, :validate => true) do |f|
      concat f.check_box(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input name="post[cost]" type="hidden" value="0" />} +
      %{<input data-validate="true" id="post_cost" name="post[cost]" type="checkbox" value="1" />}
    end
    assert_equal expected, output_buffer
  end

  def test_radio_button
    form_for(@post, :validate => true) do |f|
      concat f.radio_button(:cost, "10")
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost_10" name="post[cost]" type="radio" value="10" />}
    end
    assert_equal expected, output_buffer
  end

  def test_field_without_validations
    form_for(@post, :validate => true) do |f|
      concat f.text_field(:title)
    end

    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => {}) do
      %{<input id="post_title" name="post[title]" size="30" type="text" value="Hello World" />}
    end
    assert_equal expected, output_buffer
  end

  def test_text_field_with_validations_turned_off
    form_for(@post, :validate => true) do |f|
      concat f.text_field(:cost, :validate => false)
    end

    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => {}) do
      %{<input id="post_cost" name="post[cost]" size="30" type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_nested_fields_for_inherit_validation_settings
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment) { |c|
        concat c.text_field(:title)
      }
    end

    validators = {'post[comment][title]' => {:presence => {:message => "can't be blank"}}}
    expected =  whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_comment_title" name="post[comment][title]" size="30" type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_nested_fields_for_dont_overwrite_validation_with_inheritance
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment, :validate => false) { |c|
        concat c.text_field(:title)
      }
    end

    expected =  whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :validators => {}) do
      %{<input id="post_comment_title" name="post[comment][title]" size="30" type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_with_custom_id_for_form
    form_for(@post, :validate => true, :html => { :id => 'some_form' }) do |f|
      concat f.text_field(:cost)
    end

    validators = {'post[cost]' => {:presence => {:message => "can't be blank"}}}
    expected = whole_form("/posts/123", "some_form", "edit_post", :method => "put", :validators => validators) do
      %{<input data-validate="true" id="post_cost" name="post[cost]" size="30" type="text" />}
    end
    assert_equal expected, output_buffer
  end
end


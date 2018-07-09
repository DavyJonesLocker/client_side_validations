# frozen_string_literal: true

require 'action_view/cases/helper'

module ClientSideValidations
  class ActionViewHelpersTest < ::ActionView::TestCase
    include ActionViewTestSetup

    cattr_accessor :field_error_proc
    @@field_error_proc = proc { |html_tag, _| html_tag }

    def client_side_form_settings_helper
      {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: %(<span id="input_tag" />),
        label_tag: %(<label id="label_tag" />)
      }
    end

    def test_text_field
      form_for(@post, validate: true) do |f|
        concat f.text_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'text')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_password_field
      form_for(@post, validate: true) do |f|
        concat f.password_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'password')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_file_field
      form_for(@post, validate: true) do |f|
        concat f.file_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators, file: true) do
        form_field('input', 'post_cost', 'post[cost]', 'file')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_search_field
      form_for(@post, validate: true) do |f|
        concat f.search_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'search')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_telephone_field
      form_for(@post, validate: true) do |f|
        concat f.telephone_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'tel')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_phone_field
      form_for(@post, validate: true) do |f|
        concat f.phone_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'tel')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_url_field
      form_for(@post, validate: true) do |f|
        concat f.url_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'url')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_email_field
      form_for(@post, validate: true) do |f|
        concat f.email_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'email')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_number_field
      form_for(@post, validate: true) do |f|
        concat f.number_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'number')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_range_field
      form_for(@post, validate: true) do |f|
        concat f.range_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'range')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_check_box
      form_for(@post, validate: true) do |f|
        concat f.check_box(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', nil, 'post[cost]', 'hidden', '0') +
          form_field('input', 'post_cost', 'post[cost]', 'checkbox', '1')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_check_box_ensure_no_validate_attribute
      form_for(@post, validate: true) do |f|
        concat f.check_box(:cost, validate: true)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', nil, 'post[cost]', 'hidden', '0') +
          form_field('input', 'post_cost', 'post[cost]', 'checkbox', '1')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_radio_button
      form_for(@post, validate: true) do |f|
        concat f.radio_button(:cost, '10')
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost_10', 'post[cost]', 'radio', '10')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_radio_button_ensure_no_validate_attribute
      form_for(@post, validate: true) do |f|
        concat f.radio_button(:cost, '10', validate: true)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost_10', 'post[cost]', 'radio', '10')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_field_without_validations
      form_for(@post, validate: true) do |f|
        concat f.text_field(:title)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('input', 'post_title', 'post[title]', 'text')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_text_field_with_validations_turned_off
      form_for(@post, validate: true) do |f|
        concat f.text_field(:cost, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('input', 'post_cost', 'post[cost]', 'text')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_nested_fields_for_inherit_validation_settings
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comment, @comment) { |c|
          concat c.text_field(:title)
        }
      end

      validators = { 'post[comment][title]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_comment_title', 'post[comment][title]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_nested_fields_for_inherit_validation_settings_when_record_object_is_a_hash
      record_object = { defaults: nil }
      post_with_category = Post.new
      post_with_category.category = Category.new

      form_for(post_with_category, validate: true) do |f|
        concat f.fields_for(:category, record_object) { |c|
          concat c.text_field(:title)
        }
      end

      validators = { 'post[category_attributes][title]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_category_attributes_title', 'post[category_attributes][title]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_multiple_nested_fields_for_inherit_validation_settings
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comment, @comment) { |c|
          concat c.text_field(:title)
        }
        concat f.fields_for(:comment, @comment) { |c|
          concat c.text_field(:body)
        }
      end

      validators = { 'post[comment][title]' => { presence: [{ message: "can't be blank" }] }, 'post[comment][body]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_comment_title', 'post[comment][title]', 'text') +
          form_field('input', 'post_comment_body', 'post[comment][body]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_nested_fields_for_with_nested_attributes
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comments, [@comment]) { |c|
          concat c.text_field(:title)
        }
      end

      validators = { 'post[comments_attributes][][title]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_comments_attributes_0_title', 'post[comments_attributes][0][title]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_nested_fields_for_with_nested_attributes_with_child_index
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comments, [Comment.new], child_index: '__INDEX__') { |c|
          concat c.text_field(:title)
        }
      end

      validators = { 'post[comments_attributes][][title]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_comments_attributes___INDEX___title', 'post[comments_attributes][__INDEX__][title]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_nested_fields_for_dont_overwrite_validation_with_inheritance
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comment, @comment, validate: false) { |c|
          concat c.text_field(:title)
        }
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('input', 'post_comment_title', 'post[comment][title]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_with_custom_id_for_form
      form_for(@post, validate: true, html: { id: 'some_form' }) do |f|
        concat f.text_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'some_form', 'new_post', validators: validators, custom_id: true) do
        form_field('input', 'post_cost', 'post[cost]', 'text')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_select
      form_for(@post, validate: true) do |f|
        concat f.select(:cost, [])
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_select_with_block
      form_for(@post, validate: true) do |f|
        f.select :cost, [] do
          'block content'
        end
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        %(<select name="post[cost]" id="post_cost">block content</select>)
      end
      assert_dom_equal expected, output_buffer
    end

    def test_select_with_validate_options
      form_for(@post, validate: true) do |f|
        concat f.select(:cost, [], {}, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_select_multiple
      form_for(@post, validate: true) do |f|
        concat f.select(:cost, [], {}, multiple: true)
      end

      validators = { 'post[cost][]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        %(#{hidden_input_for_select('post[cost][]')}#{form_field('select', 'post_cost', 'post[cost][]', nil, nil, true)})
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_select
      form_for(@post, validate: true) do |f|
        concat f.collection_select(:cost, [], :id, :name)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_select_with_association
      form_for(@post, validate: true) do |f|
        concat f.collection_select(:category_id, [], :id, :name)
      end

      validators = { 'post[category_id]' => { presence: [{ message: 'must exist' }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('select', 'post_category_id', 'post[category_id]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_select_with_validate_options
      form_for(@post, validate: true) do |f|
        concat f.collection_select(:cost, [], :id, :name, {}, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_grouped_collection_select
      form_for(@post, validate: true) do |f|
        concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_grouped_collection_select_with_validate_options
      form_for(@post, validate: true) do |f|
        concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name, {}, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_check_boxes
      form_for(@post, validate: true) do |f|
        concat f.collection_check_boxes(:cost, [], :id, :name)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', nil, 'post[cost][]', 'hidden', '')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_check_boxes_with_validate_options
      form_for(@post, validate: true) do |f|
        concat f.collection_check_boxes(:cost, [], :id, :name, {}, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('input', nil, 'post[cost][]', 'hidden', '')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_radio_buttons
      form_for(@post, validate: true) do |f|
        concat f.collection_radio_buttons(:cost, [], :id, :name)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', nil, 'post[cost]', 'hidden', '')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_radio_buttons_with_validate_options
      form_for(@post, validate: true) do |f|
        concat f.collection_radio_buttons(:cost, [], :id, :name, {}, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('input', nil, 'post[cost]', 'hidden', '')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_time_zone_select
      zones = mock('TimeZones')
      zones.stubs(:all).returns([])
      form_for(@post, validate: true) do |f|
        concat f.time_zone_select(:cost, nil, model: zones)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_time_zone_select_with_validate_options
      zones = mock('TimeZones')
      zones.stubs(:all).returns([])
      form_for(@post, validate: true) do |f|
        concat f.time_zone_select(:cost, nil, { model: zones }, validate: false)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('select', 'post_cost', 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_text_area
      form_for(@post, validate: true) do |f|
        concat f.text_area(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('textarea', 'post_cost', 'post[cost]', nil, nil, nil, "\n")
      end
      assert_dom_equal expected, output_buffer
    end

    def test_as_form_option_with_new_record_rails
      form_for(@post, as: :article, validate: true) do
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts', 'new_article', 'new_article', validators: {}) do
        %(<span>Dummy Content</span>)
      end
      assert_dom_equal expected, output_buffer
    end

    def test_as_form_option_with_existing_record_rails
      @post.stubs(:persisted?).returns(true)
      @post.stubs(:id).returns(123)
      form_for(@post, as: :article, validate: true) do
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts/123', 'edit_article', 'edit_article', method: 'patch', validators: {}) do
        %(<span>Dummy Content</span>)
      end
      assert_dom_equal expected, output_buffer
    end

    def test_namespace_form_option_with_new_record
      form_for(Post.new, namespace: :blog, validate: true) do
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts', 'blog_new_post', 'new_post', validators: {}) do
        %(<span>Dummy Content</span>)
      end
      assert_dom_equal expected, output_buffer
    end

    def test_namespace_form_option_with_existing_record
      @post.stubs(:persisted?).returns(true)
      @post.stubs(:id).returns(123)
      form_for(@post, namespace: :blog, validate: true) do
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts/123', 'blog_edit_post_123', 'edit_post', method: 'patch', validators: {}) do
        %(<span>Dummy Content</span>)
      end
      assert_dom_equal expected, output_buffer
    end

    def test_string_as_record
      assert_raise ClientSideValidations::ActionView::Helpers::FormHelper::Error do
        form_for('post', validate: true) do |f|
          concat f.text_field(:cost)
        end
      end
    end

    def test_symbol_as_record
      assert_raise ClientSideValidations::ActionView::Helpers::FormHelper::Error do
        form_for(:post, validate: true) do |f|
          concat f.text_field(:cost)
        end
      end
    end

    def test_text_field_with_custom_name
      form_for(@post, validate: true) do |f|
        concat f.text_field(:cost, name: :postcost)
      end

      validators = { 'postcost' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', nil, 'text', nil, nil, nil, 'postcost')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_added_validators
      form_for(@post, validate: true) do |f|
        concat f.validate(:cost, :body, :title)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] }, 'post[body]' => { presence: [{ message: "can't be blank" }], length: [{ messages: { minimum: 'is too short (minimum is 200 characters)' }, minimum: 200 }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators)
      assert_dom_equal expected, output_buffer
    end

    def test_added_validators_defaulting_to_all
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comment, @comment) { |c|
          concat c.validate
        }
      end

      validators = { 'post[comment][title]' => { presence: [{ message: "can't be blank" }] }, 'post[comment][body]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators)
      assert_dom_equal expected, output_buffer
    end

    def test_added_validators_with_filters
      form_for(@post, validate: true) do |f|
        concat f.validate(:cost, :body, :title, length: false)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] }, 'post[body]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators)
      assert_dom_equal expected, output_buffer
    end

    def test_field_with_index_set
      form_for(@post, validate: true) do |f|
        concat f.fields_for(:comment, @comment, index: 5) { |c|
          concat c.text_field(:title)
        }
      end

      validators = { 'post[comment][5][title]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_comment_5_title', 'post[comment][5][title]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_object_without_client_side_validation_hash_method
      @post.singleton_class.send(:undef_method, :client_side_validation_hash)

      form_for(@post, validate: true) do |f|
        concat f.text_field(:cost)
      end

      expected = whole_form('/posts', 'new_post', 'new_post', validators: {}) do
        form_field('input', 'post_cost', 'post[cost]', 'text')
      end

      assert_dom_equal expected, output_buffer
    end

    def test_number_format_with_locale
      ClientSideValidations::Config.stubs(:number_format_with_locale).returns(true)
      I18n.stubs(:t).with('number.format').returns(separator: ',', delimiter: '.')

      form_for(@post, validate: true) do |f|
        concat f.text_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'text')
      end.gsub(CGI.escapeHTML('{"separator":".","delimiter":","}'), CGI.escapeHTML('{"separator":",","delimiter":"."}'))

      assert_dom_equal expected, output_buffer
    end

    def test_number_format_with_delimiters_allowed
      ClientSideValidations::Config.stubs(:allow_delimiters_in_numbers).returns(true)

      form_for(@post, validate: true) do |f|
        concat f.text_field(:cost)
      end

      validators = { 'post[cost]' => { presence: [{ message: "can't be blank" }] } }
      expected = whole_form('/posts', 'new_post', 'new_post', validators: validators) do
        form_field('input', 'post_cost', 'post[cost]', 'text')
      end.gsub(CGI.escapeHTML('{"separator":".","delimiter":",","allow_delimiters_in_numbers":true}'), CGI.escapeHTML('{"separator":",","delimiter":".",allow_delimiters_in_numbers":true}'))

      assert_dom_equal expected, output_buffer
    end
  end

  def test_field_with_format_a
    assert_field_with_format_has_source(:a, 'a')
  end

  def test_field_with_format_backslash
    assert_field_with_format_has_source(:backslash, '\\\\')
  end

  def test_field_with_format_space
    # regression test for issue #460
    assert_field_with_format_has_source(:space, ' ')
  end

  def test_field_with_format_escaped_space
    assert_field_with_format_has_source(:escaped_space, '\\ ')
  end

  def test_field_with_format_ascii_escape
    assert_field_with_format_has_source(:ascii_escape, '\\x41')
  end

  def test_field_with_format_unicode_escape
    assert_field_with_format_has_source(:unicode_escape, '\\u263A')
  end

  def test_field_with_format_unicode_literal
    assert_field_with_format_has_source(:unicode_literal, '☺')
  end

  def test_field_with_format_newline_escape
    assert_field_with_format_has_source(:newline_escape, '\\n')
  end

  def test_field_with_format_newline_literal
    assert_field_with_format_has_source(:newline_literal, '\\n')
  end

  def test_field_with_format_devise_email
    assert_field_with_format_has_source(:devise_email, '^[^@\\s]+@([^@\\s]+\\.)+[^@\\W]+$')
  end

  def assert_field_with_format_has_source(field, expected_source)
    form_for(@format_thing, validate: true) { |f| concat(f.text_field(field)) }

    validators = {
      "format_thing[#{field}]" => { format: [{ message: 'is invalid', with:
        { source: expected_source, options: 'g' } }] }
    }

    expected = whole_form('/format_things', 'new_format_thing', 'new_format_thing', validators: validators) do
      form_field('input', "format_thing_#{field}", "format_thing[#{field}]", 'text')
    end

    assert_dom_equal expected, output_buffer
  end
end

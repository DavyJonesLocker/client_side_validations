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

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_password_field
    form_for(@post, :validate => true) do |f|
      concat f.password_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="password" />}
    end
    assert_equal expected, output_buffer
  end

  def test_file_field
    form_for(@post, :validate => true, :html => {:multipart => true}) do |f|
      concat f.file_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators, :file => true) do
      %{<input id="post_cost" name="post[cost]" type="file" />}
    end
    assert_equal expected, output_buffer
  end

  def test_search_field
    form_for(@post, :validate => true) do |f|
      concat f.search_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="search" />}
    end
    assert_equal expected, output_buffer
  end

  def test_telephone_field
    form_for(@post, :validate => true) do |f|
      concat f.telephone_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="tel" />}
    end
    assert_equal expected, output_buffer
  end

  def test_phone_field
    form_for(@post, :validate => true) do |f|
      concat f.phone_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="tel" />}
    end
    assert_equal expected, output_buffer
  end

  def test_url_field
    form_for(@post, :validate => true) do |f|
      concat f.url_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="url" />}
    end
    assert_equal expected, output_buffer
  end

  def test_email_field
    form_for(@post, :validate => true) do |f|
      concat f.email_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="email" />}
    end
    assert_equal expected, output_buffer
  end

  def test_number_field
    form_for(@post, :validate => true) do |f|
      concat f.number_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size('number_field')}type="number" />}
    end
    assert_equal expected, output_buffer
  end

  def test_range_field
    form_for(@post, :validate => true) do |f|
      concat f.range_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size('range_field')}type="range" />}
    end
    assert_equal expected, output_buffer
  end

  def test_check_box
    form_for(@post, :validate => true) do |f|
      concat f.check_box(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input name="post[cost]" type="hidden" value="0" />} +
      %{<input id="post_cost" name="post[cost]" type="checkbox" value="1" />}
    end
    assert_equal expected, output_buffer
  end

  def test_check_box_ensure_no_validate_attribute
    form_for(@post, :validate => true) do |f|
      concat f.check_box(:cost, :validate => true)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input name="post[cost]" type="hidden" value="0" />} +
      %{<input id="post_cost" name="post[cost]" type="checkbox" value="1" />}
    end
    assert_equal expected, output_buffer
  end

  def test_radio_button
    form_for(@post, :validate => true) do |f|
      concat f.radio_button(:cost, "10")
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost_10" name="post[cost]" type="radio" value="10" />}
    end
    assert_equal expected, output_buffer
  end

  def test_radio_button_ensure_no_validate_attribute
    form_for(@post, :validate => true) do |f|
      concat f.radio_button(:cost, "10", :validate => true)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost_10" name="post[cost]" type="radio" value="10" />}
    end
    assert_equal expected, output_buffer
  end

  def test_field_without_validations
    form_for(@post, :validate => true) do |f|
      concat f.text_field(:title)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<input id="post_title" name="post[title]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_text_field_with_validations_turned_off
    form_for(@post, :validate => true) do |f|
      concat f.text_field(:cost, :validate => false)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_nested_fields_for_inherit_validation_settings
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment) { |c|
        concat c.text_field(:title)
      }
    end

    validators = {'post[comment][title]' => {:presence => [{:message => "can't be blank"}]}}
    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_comment_title" name="post[comment][title]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_multiple_nested_fields_for_inherit_validation_settings
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment) { |c|
        concat c.text_field(:title)
      }
      concat f.fields_for(:comment, @comment) { |c|
        concat c.text_field(:body)
      }
    end

    validators = {'post[comment][title]' => {:presence => [{:message => "can't be blank"}]}, 'post[comment][body]' => {:presence => [{:message => "can't be blank"}]}}
    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_comment_title" name="post[comment][title]" #{legacy_size}type="text" />} +
      %{<input id="post_comment_body" name="post[comment][body]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_nested_fields_for_with_nested_attributes
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comments, [@comment]) { |c|
        concat c.text_field(:title)
      }
    end

    validators = {'post[comments_attributes][][title]' => {:presence => [{:message => "can't be blank"}]}}
    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_comments_attributes_0_title" name="post[comments_attributes][0][title]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_nested_fields_for_with_nested_attributes_with_child_index
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comments, [Comment.new], :child_index => '__INDEX__') { |c|
        concat c.text_field(:title)
      }
    end

    validators = {'post[comments_attributes][][title]' => {:presence => [{:message => "can't be blank"}]}}
    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_comments_attributes___INDEX___title" name="post[comments_attributes][__INDEX__][title]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end


  def test_nested_fields_for_dont_overwrite_validation_with_inheritance
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment, :validate => false) { |c|
        concat c.text_field(:title)
      }
    end

    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<input id="post_comment_title" name="post[comment][title]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_with_custom_id_for_form
    form_for(@post, :validate => true, :html => { :id => 'some_form' }) do |f|
      concat f.text_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'some_form', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_select
    form_for(@post, :validate => true) do |f|
      concat f.select(:cost, [])
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_select_with_validate_options
    form_for(@post, :validate => true) do |f|
      concat f.select(:cost, [], {}, :validate => false)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_select_multiple
    form_for(@post, :validate => true) do |f|
      concat f.select(:cost, [], {}, :multiple => true)
    end

    validators = {'post[cost][]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{#{hidden_input_for_select('post[cost][]')}<select id="post_cost" multiple="multiple" name="post[cost][]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_collection_select
    form_for(@post, :validate => true) do |f|
      concat f.collection_select(:cost, [], :id, :name)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_collection_select_with_validate_options
    form_for(@post, :validate => true) do |f|
      concat f.collection_select(:cost, [], :id, :name, {}, :validate => false)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_grouped_collection_select
    form_for(@post, :validate => true) do |f|
      concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_grouped_collection_select_with_validate_options
    form_for(@post, :validate => true) do |f|
      concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name, {}, :validate => false)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_time_zone_select
    zones = mock('TimeZones')
    zones.stubs(:all).returns([])
    form_for(@post, :validate => true) do |f|
      concat f.time_zone_select(:cost, nil, :model => zones)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_time_zone_select_with_validate_options
    zones = mock('TimeZones')
    zones.stubs(:all).returns([])
    form_for(@post, :validate => true) do |f|
      concat f.time_zone_select(:cost, nil, { :model => zones }, { :validate => false })
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_pushing_script_to_content_for
    form_for(@post, :validate => :post) do |f|
      concat f.text_field(:cost)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
    expected = %{<form accept-charset="UTF-8" action="/posts" class="new_post" data-validate="true" id="new_post" method="post" novalidate="novalidate"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div><input id="post_cost" name="post[cost]" #{legacy_size}type="text" /></form>}
    assert_equal expected, output_buffer
    assert_equal build_script_tag(nil, 'new_post', validators), content_for(:post)
  end

  if Rails.version >= '3.2.0'
    def test_text_area
      form_for(@post, :validate => true) do |f|
        concat f.text_area(:cost)
      end

      validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
      expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
        %{<textarea id="post_cost" name="post[cost]">\n</textarea>}
      end
      assert_equal expected, output_buffer
    end

    def test_as_form_option_with_new_record_rails
      form_for(@post, :as => :article, :validate => true) do |f|
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts', 'new_article', 'new_article', :validators => {}) do
        %{<span>Dummy Content</span>}
      end
      assert_equal expected, output_buffer
    end

    def test_as_form_option_with_existing_record_rails
      @post.stubs(:persisted?).returns(true)
      @post.stubs(:id).returns(123)
      form_for(@post, :as => :article, :validate => true) do |f|
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts/123', 'edit_article', 'edit_article', :method => 'patch', :validators => {}) do
        %{<span>Dummy Content</span>}
      end
      assert_equal expected, output_buffer
    end

    def test_namespace_form_option_with_new_record
      test_buffer = form_for(Post.new, :namespace => :blog, :validate => true) do |f|
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts', 'blog_new_post', 'new_post', :validators => {}) do
        %{<span>Dummy Content</span>}
      end
      assert_equal expected, output_buffer
    end

    def test_namespace_form_option_with_existing_record
      @post.stubs(:persisted?).returns(true)
      @post.stubs(:id).returns(123)
      test_buffer = form_for(@post, :namespace => :blog, :validate => true) do |f|
        concat content_tag(:span, 'Dummy Content')
      end
      expected = whole_form('/posts/123', 'blog_edit_post_123', 'edit_post', :method => 'patch', :validators => {}) do
        %{<span>Dummy Content</span>}
      end
      assert_equal expected, output_buffer
    end

  elsif Rails.version >= '3.1.0' && Rails.version < '3.2.0'
    def test_text_area
      form_for(@post, :validate => true) do |f|
        concat f.text_area(:cost)
      end

      validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}}
      expected = whole_form('/posts', 'new_post', 'new_post', :method => 'post', :validators => validators) do
        %{<textarea cols="40" id="post_cost" name="post[cost]" rows="20"></textarea>}
      end
      assert_equal expected, output_buffer
    end

    def test_as_form_option_with_new_record_rails
      test_buffer = form_for(Post.new, :as => :article, :validate => true) do |f|
        concat content_tag(:span, "Dummy Content")
      end
      expected = whole_form("/posts", "article_new", "article_new", :validators => {}) do
        %{<span>Dummy Content</span>}
      end
      assert_equal expected, output_buffer
    end

    def test_as_form_option_with_existing_record_rails
      test_buffer = form_for(@post, :as => :article, :validate => true) do |f|
        concat content_tag(:span, "Dummy Content")
      end
      expected = whole_form('/posts', "article_edit", "article_edit", :method => 'post', :validators => {}) do
        %{<span>Dummy Content</span>}
      end
      assert_equal expected, output_buffer
    end
  end

  def test_string_as_record
    assert_raise ClientSideValidations::ActionView::Helpers::FormHelper::Error do
      form_for('post', :validate => true) do |f|
        concat f.text_field(:cost)
      end
    end
  end

  def test_symbol_as_record
    assert_raise ClientSideValidations::ActionView::Helpers::FormHelper::Error do
      form_for(:post, :validate => true) do |f|
        concat f.text_field(:cost)
      end
    end
  end

  def test_text_field_with_custom_name
    form_for(@post, :validate => true) do |f|
      concat f.text_field(:cost, :name => :postcost)
    end

    validators = {'postcost' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_cost" name="postcost" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_added_validators
    form_for(@post, :validate => true) do |f|
      concat f.validate(:cost, :body, :title)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}, 'post[body]' => {:presence => [{:message => "can't be blank"}], :length => [{:messages => {:minimum => 'is too short (minimum is 200 characters)'}, :minimum => 200}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators)
    assert_equal expected, output_buffer
  end

  def test_added_validators_defaulting_to_all
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment) { |c|
        concat c.validate
      }
    end

    validators = {'post[comment][title]' => {:presence => [{:message => "can't be blank"}]},'post[comment][body]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators)
    assert_equal expected, output_buffer
  end

  def test_added_validators_with_filters
    form_for(@post, :validate => true) do |f|
      concat f.validate(:cost, :body, :title, :length => false)
    end

    validators = {'post[cost]' => {:presence => [{:message => "can't be blank"}]}, 'post[body]' => {:presence => [{:message => "can't be blank"}]}}
    expected = whole_form('/posts', 'new_post', 'new_post', :validators => validators)
    assert_equal expected, output_buffer
  end

  def test_field_with_index_set
    form_for(@post, :validate => true) do |f|
      concat f.fields_for(:comment, @comment, :index => 5) { |c|
        concat c.text_field(:title)
      }
    end

    validators = {'post[comment][5][title]' => {:presence => [{:message => "can't be blank"}]}}
    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => validators) do
      %{<input id="post_comment_5_title" name="post[comment][5][title]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end

  def test_object_without_client_side_validation_hash_method
    @post.singleton_class.send(:undef_method, :client_side_validation_hash)

    form_for(@post, :validate => true) do |f|
      concat f.text_field(:cost)
    end

    expected =  whole_form('/posts', 'new_post', 'new_post', :validators => {}) do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end

    assert_equal expected, output_buffer
  end
end

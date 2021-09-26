# frozen_string_literal: true

require 'action_view/cases/helper'

module ClientSideValidations
  class LegacyFormForActionViewHelpersTest < ::ActionView::TestCase
    include ::ActionViewTestSetup

    BASE_FIELD_HELPERS.each do |field_helper, options|
      define_method(:"test_#{field_helper}") do
        form_for(@post) do |f|
          concat f.public_send(field_helper, :cost)
        end

        expected = whole_form_for('/posts', 'new_post', 'new_post') do
          form_field('input', id: 'post_cost', name: 'post[cost]', type: options[:type], **options.fetch(:html_options, {}))
        end
        assert_dom_equal expected, output_buffer
      end
    end

    def test_text_area
      form_for(@post) do |f|
        concat f.text_area(:cost)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        form_field('textarea', id: 'post_cost', name: 'post[cost]', tag_content: "\n")
      end
      assert_dom_equal expected, output_buffer
    end

    def test_file_field
      form_for(@post) do |f|
        concat f.file_field(:cost)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post', file: true) do
        form_field('input', id: 'post_cost', name: 'post[cost]', type: 'file')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_check_box
      form_for(@post) do |f|
        concat f.check_box(:cost)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        hidden_input_for_checkbox('post[cost]') +
          form_field('input', id: 'post_cost', name: 'post[cost]', type: 'checkbox', value: '1')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_radio_button
      form_for(@post) do |f|
        concat f.radio_button(:cost, '10')
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        form_field('input', id: 'post_cost_10', name: 'post[cost]', type: 'radio', value: '10')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_fields_for
      result = fields_for(@comment) do |c|
        c.text_field(:title)
      end

      expected = form_field('input', id: 'comment_title', name: 'comment[title]', type: 'text')

      assert_dom_equal expected, result
    end

    def test_select
      form_for(@post) do |f|
        concat f.select(:cost, [])
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        form_field('select', id: 'post_cost', name: 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_select_multiple
      form_for(@post) do |f|
        concat f.select(:cost, [], {}, multiple: true)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        %(#{hidden_input_for_select('post[cost][]')}#{form_field('select', id: 'post_cost', name: 'post[cost][]', multiple: true)})
      end
      assert_dom_equal expected, output_buffer
    end

    def test_collection_select
      form_for(@post) do |f|
        concat f.collection_select(:cost, [], :id, :name)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        form_field('select', id: 'post_cost', name: 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_grouped_collection_select
      form_for(@post) do |f|
        concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        form_field('select', id: 'post_cost', name: 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_time_zone_select
      zones = mock('TimeZones')
      zones.stubs(:all).returns([])
      form_for(@post) do |f|
        concat f.time_zone_select(:cost, nil, model: zones)
      end

      expected = whole_form_for('/posts', 'new_post', 'new_post') do
        form_field('select', id: 'post_cost', name: 'post[cost]')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_string_as_record
      form_for('post') do |f|
        concat f.text_field(:cost)
      end

      expected = whole_form_for('/') do
        form_field('input', id: 'post_cost', name: 'post[cost]', type: 'text')
      end
      assert_dom_equal expected, output_buffer
    end

    def test_symbol_as_record
      form_for(:post) do |f|
        concat f.text_field(:cost)
      end

      expected = whole_form_for('/') do
        form_field('input', id: 'post_cost', name: 'post[cost]', type: 'text')
      end
      assert_dom_equal expected, output_buffer
    end
  end
end

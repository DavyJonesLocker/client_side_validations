# frozen_string_literal: true

require 'action_view/cases/helper'

if ActionView::Helpers::FormHelper.method_defined?(:form_with)
  module ClientSideValidations
    class LegacyFormWithActionViewHelpersTest < ::ActionView::TestCase
      include ::ActionViewTestSetup

      BASE_FIELD_HELPERS.each do |field_helper, options|
        define_method(:"test_form_with_#{field_helper}") do
          form_with(model: @post) do |f|
            concat f.public_send(field_helper, :cost)
          end

          expected = whole_form_with('/posts') do
            form_field('input', name: 'post[cost]', id: 'post_cost', type: options[:type], **options.fetch(:html_options, {}))
          end

          assert_dom_equal expected, output_buffer
        end
      end

      def test_form_with_text_area
        form_with(model: @post) do |f|
          concat f.text_area(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('textarea', name: 'post[cost]', id: 'post_cost', tag_content: "\n")
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_file_field
        form_with(model: @post) do |f|
          concat f.file_field(:cost)
        end

        expected = whole_form_with('/posts', file: true) do
          form_field('input', name: 'post[cost]', id: 'post_cost', type: 'file')
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_check_box
        form_with(model: @post) do |f|
          concat f.check_box(:cost)
        end

        expected = whole_form_with('/posts') do
          hidden_input_for_checkbox('post[cost]') +
            form_field('input', name: 'post[cost]', id: 'post_cost', type: 'checkbox', value: '1')
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_radio_button
        form_with(model: @post) do |f|
          concat f.radio_button(:cost, '10')
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', id: 'post_cost_10', type: 'radio', value: '10')
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_fields_for
        result = fields_for(@comment) do |c|
          c.text_field(:title)
        end

        expected = form_field('input', id: 'comment_title', name: 'comment[title]', type: 'text')

        assert_dom_equal expected, result
      end

      def test_form_with_fields
        result = fields(:comment, model: @comment) do |c|
          c.text_field(:title)
        end

        expected = form_field('input', id: 'comment_title', name: 'comment[title]', type: 'text')

        assert_dom_equal expected, result
      end

      def test_form_with_select
        form_with(model: @post) do |f|
          concat f.select(:cost, [])
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]', id: 'post_cost')
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_select_multiple
        form_with(model: @post) do |f|
          concat f.select(:cost, [], {}, multiple: true)
        end

        expected = whole_form_with('/posts') do
          %(#{hidden_input_for_select('post[cost][]')}#{form_field('select', name: 'post[cost][]', id: 'post_cost', multiple: true)})
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_collection_select
        form_with(model: @post) do |f|
          concat f.collection_select(:cost, [], :id, :name)
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]', id: 'post_cost')
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_grouped_collection_select
        form_with(model: @post) do |f|
          concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]', id: 'post_cost')
        end

        assert_dom_equal expected, output_buffer
      end

      def test_form_with_time_zone_select
        zones = mock('TimeZones')
        zones.stubs(:all).returns([])
        form_with(model: @post) do |f|
          concat f.time_zone_select(:cost, nil, model: zones)
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]', id: 'post_cost')
        end

        assert_dom_equal expected, output_buffer
      end
    end
  end
end

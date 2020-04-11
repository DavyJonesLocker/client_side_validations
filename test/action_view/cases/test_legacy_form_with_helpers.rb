# frozen_string_literal: true

require 'action_view/cases/helper'

if ::ActionView::Helpers::FormHelper.method_defined?(:form_with)
  module ClientSideValidations
    class LegacyFormWithActionViewHelpersTest < ::ActionView::TestCase
      include ::ActionViewTestSetup

      def automatic_id(id)
        id if Rails.version >= '5.2'
      end

      def test_text_field
        form_with(model: @post) do |f|
          concat f.text_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'text')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_password_field
        form_with(model: @post) do |f|
          concat f.password_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'password')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_file_field
        form_with(model: @post) do |f|
          concat f.file_field(:cost)
        end

        expected = whole_form_with('/posts', file: true) do
          form_field('input', name: 'post[cost]', type: 'file')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_text_area
        form_with(model: @post) do |f|
          concat f.text_area(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('textarea', name: 'post[cost]', tag_content: "\n")
        end
        assert_dom_equal expected, output_buffer
      end

      def test_search_field
        form_with(model: @post) do |f|
          concat f.search_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'search')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_telephone_field
        form_with(model: @post) do |f|
          concat f.telephone_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'tel')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_phone_field
        form_with(model: @post) do |f|
          concat f.phone_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'tel')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_url_field
        form_with(model: @post) do |f|
          concat f.url_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'url')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_email_field
        form_with(model: @post) do |f|
          concat f.email_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'email')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_number_field
        form_with(model: @post) do |f|
          concat f.number_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'number')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_range_field
        form_with(model: @post) do |f|
          concat f.range_field(:cost)
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'range')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_check_box
        form_with(model: @post) do |f|
          concat f.check_box(:cost)
        end

        expected = whole_form_with('/posts') do
          %(<input name="post[cost]" type="hidden" value="0" />) +
            form_field('input', name: 'post[cost]', type: 'checkbox', value: '1')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_radio_button
        form_with(model: @post) do |f|
          concat f.radio_button(:cost, '10')
        end

        expected = whole_form_with('/posts') do
          form_field('input', name: 'post[cost]', type: 'radio', value: '10')
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
        form_with(model: @post) do |f|
          concat f.select(:cost, [])
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_select_multiple
        form_with(model: @post) do |f|
          concat f.select(:cost, [], {}, multiple: true)
        end

        expected = whole_form_with('/posts') do
          %(#{hidden_input_for_select('post[cost][]')}#{form_field('select', name: 'post[cost][]', multiple: true)})
        end
        assert_dom_equal expected, output_buffer
      end

      def test_collection_select
        form_with(model: @post) do |f|
          concat f.collection_select(:cost, [], :id, :name)
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_grouped_collection_select
        form_with(model: @post) do |f|
          concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]')
        end
        assert_dom_equal expected, output_buffer
      end

      def test_time_zone_select
        zones = mock('TimeZones')
        zones.stubs(:all).returns([])
        form_with(model: @post) do |f|
          concat f.time_zone_select(:cost, nil, model: zones)
        end

        expected = whole_form_with('/posts') do
          form_field('select', name: 'post[cost]')
        end
        assert_dom_equal expected, output_buffer
      end
    end
  end
end

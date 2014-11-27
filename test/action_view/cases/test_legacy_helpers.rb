require 'action_view/cases/helper'

class ClientSideValidations::LegacyActionViewHelpersTest < ActionView::TestCase
  include ActionViewTestSetup

  def test_text_field
    form_for(@post) do |f|
      concat f.text_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'text')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_password_field
    form_for(@post) do |f|
      concat f.password_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'password')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_file_field
    form_for(@post, html: {multipart: true}) do |f|
      concat f.file_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', file: true) do
      form_field('input', 'post_cost', 'post[cost]', 'file')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_text_area
    form_for(@post) do |f|
      concat f.text_area(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('textarea', 'post_cost', 'post[cost]', nil, nil, nil, "\n")
    end
    assert_dom_equal expected, output_buffer
  end

  def test_search_field
    form_for(@post) do |f|
      concat f.search_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'search')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_telephone_field
    form_for(@post) do |f|
      concat f.telephone_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'tel')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_phone_field
    form_for(@post) do |f|
      concat f.phone_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'tel')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_url_field
    form_for(@post) do |f|
      concat f.url_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'url')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_email_field
    form_for(@post) do |f|
      concat f.email_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'email')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_number_field
    form_for(@post) do |f|
      concat f.number_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'number')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_range_field
    form_for(@post) do |f|
      concat f.range_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost', 'post[cost]', 'range')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_check_box
    form_for(@post) do |f|
      concat f.check_box(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input name="post[cost]" type="hidden" value="0" />} +
      form_field('input', 'post_cost', 'post[cost]', 'checkbox', '1')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_radio_button
    form_for(@post) do |f|
      concat f.radio_button(:cost, "10")
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('input', 'post_cost_10', 'post[cost]', 'radio', '10')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_fields_for
    result = fields_for(@comment) do |c|
      c.text_field(:title)
    end

    expected = form_field('input', 'comment_title', 'comment[title]', 'text')

    assert_dom_equal expected, result
  end

  def test_select
    form_for(@post) do |f|
      concat f.select(:cost, [])
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('select', 'post_cost', 'post[cost]')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_select_multiple
    form_for(@post) do |f|
      concat f.select(:cost, [], {}, multiple: true)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{#{hidden_input_for_select('post[cost][]')}#{form_field('select', 'post_cost', 'post[cost][]', nil, nil, true)}}
    end
    assert_dom_equal expected, output_buffer
  end

  def test_collection_select
    form_for(@post) do |f|
      concat f.collection_select(:cost, [], :id, :name)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('select', 'post_cost', 'post[cost]')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_grouped_collection_select
    form_for(@post) do |f|
      concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('select', 'post_cost', 'post[cost]')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_time_zone_select
    zones = mock('TimeZones')
    zones.stubs(:all).returns([])
    form_for(@post) do |f|
      concat f.time_zone_select(:cost, nil, model: zones)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      form_field('select', 'post_cost', 'post[cost]')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_string_as_record
    form_for('post') do |f|
      concat f.text_field(:cost)
    end

    expected = whole_form('/') do
      form_field('input', 'post_cost', 'post[cost]', 'text')
    end
    assert_dom_equal expected, output_buffer
  end

  def test_symbol_as_record
    form_for(:post) do |f|
      concat f.text_field(:cost)
    end

    expected = whole_form('/') do
      form_field('input', 'post_cost', 'post[cost]', 'text')
    end
    assert_dom_equal expected, output_buffer
  end
end

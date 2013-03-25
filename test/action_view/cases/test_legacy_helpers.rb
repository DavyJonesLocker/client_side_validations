require 'action_view/cases/helper'

class ClientSideValidations::LegacyActionViewHelpersTest < ActionView::TestCase
  include ActionViewTestSetup

  def test_text_field
    form_for(@post) do |f|
      concat f.text_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_password_field
    form_for(@post) do |f|
      concat f.password_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="password" />}
    end
    assert_equal expected, output_buffer
  end

  def test_file_field
    form_for(@post, :html => {:multipart => true}) do |f|
      concat f.file_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post', :file => true) do
      %{<input id="post_cost" name="post[cost]" type="file" />}
    end
    assert_equal expected, output_buffer
  end

  def test_text_area
    form_for(@post) do |f|
      concat f.text_area(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<textarea id="post_cost" name="post[cost]">\n</textarea>}
    end
    assert_equal expected, output_buffer
  end

  def test_search_field
    form_for(@post) do |f|
      concat f.search_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="search" />}
    end
    assert_equal expected, output_buffer
  end

  def test_telephone_field
    form_for(@post) do |f|
      concat f.telephone_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="tel" />}
    end
    assert_equal expected, output_buffer
  end

  def test_phone_field
    form_for(@post) do |f|
      concat f.phone_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="tel" />}
    end
    assert_equal expected, output_buffer
  end

  def test_url_field
    form_for(@post) do |f|
      concat f.url_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="url" />}
    end
    assert_equal expected, output_buffer
  end

  def test_email_field
    form_for(@post) do |f|
      concat f.email_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="email" />}
    end
    assert_equal expected, output_buffer
  end

  def test_number_field
    form_for(@post) do |f|
      concat f.number_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size('number_field')}type="number" />}
    end
    assert_equal expected, output_buffer
  end

  def test_range_field
    form_for(@post) do |f|
      concat f.range_field(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size('range_field')}type="range" />}
    end
    assert_equal expected, output_buffer
  end

  def test_check_box
    form_for(@post) do |f|
      concat f.check_box(:cost)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input name="post[cost]" type="hidden" value="0" />} +
      %{<input id="post_cost" name="post[cost]" type="checkbox" value="1" />}
    end
    assert_equal expected, output_buffer
  end

  def test_radio_button
    form_for(@post) do |f|
      concat f.radio_button(:cost, "10")
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<input id="post_cost_10" name="post[cost]" type="radio" value="10" />}
    end
    assert_equal expected, output_buffer
  end

  def test_fields_for
    result = fields_for(@comment) do |c|
      c.text_field(:title)
    end

    expected = %{<input id="comment_title" name="comment[title]" #{legacy_size}type="text" />}

    assert_equal expected, result
  end

  def test_select
    form_for(@post) do |f|
      concat f.select(:cost, [])
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_select_multiple
    form_for(@post) do |f|
      concat f.select(:cost, [], {}, :multiple => true)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{#{hidden_input_for_select('post[cost][]')}<select id="post_cost" multiple="multiple" name="post[cost][]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_collection_select
    form_for(@post) do |f|
      concat f.collection_select(:cost, [], :id, :name)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_grouped_collection_select
    form_for(@post) do |f|
      concat f.grouped_collection_select(:cost, [], :group_method, :group_label_method, :id, :name)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_time_zone_select
    zones = mock('TimeZones')
    zones.stubs(:all).returns([])
    form_for(@post) do |f|
      concat f.time_zone_select(:cost, nil, :model => zones)
    end

    expected = whole_form('/posts', 'new_post', 'new_post') do
      %{<select id="post_cost" name="post[cost]"></select>}
    end
    assert_equal expected, output_buffer
  end

  def test_string_as_record
    form_for('post') do |f|
      concat f.text_field(:cost)
    end

    expected = whole_form('/') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end

  def test_symbol_as_record
    form_for(:post) do |f|
      concat f.text_field(:cost)
    end

    expected = whole_form('/') do
      %{<input id="post_cost" name="post[cost]" #{legacy_size}type="text" />}
    end
    assert_equal expected, output_buffer
  end
end


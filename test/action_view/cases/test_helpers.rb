require 'action_view/cases/helper'

class ClientSideValidations::ActionViewTest < ActionView::TestCase
  tests ClientSideValidations::ActionView::Helpers::FormHelper
  include ActionViewTestSetup

  def test_form_for_legacy
    assert_deprecated do
      form_for(:post, @post, :html => { :id => 'create-post' }) do |f|
        concat f.label(:title) { "The Title" }
        concat f.text_field(:title)
        concat f.text_area(:body)
        concat f.check_box(:secret)
        concat f.submit('Create post')
      end
    end

    expected =
      "<form accept-charset='UTF-8' action='http://www.example.com' id='create-post' method='post'>" +
      snowman +
      "<label for='post_title'>The Title</label>" +
      "<input name='post[title]' size='30' type='text' id='post_title' value='Hello World' />" +
      "<textarea name='post[body]' id='post_body' rows='20' cols='40'>Back to the hill and over it again!</textarea>" +
      "<input name='post[secret]' type='hidden' value='0' />" +
      "<input name='post[secret]' checked='checked' type='checkbox' id='post_secret' value='1' />" +
      "<input name='commit' id='post_submit' type='submit' value='Create post' />" +
      "</form>"

    assert_dom_equal expected, output_buffer
  end

  def test_form_for_client_side_validations
    assert_raise(ClientSideValidations::ActionView::Helpers::FormHelper::Error) do
      form_for(:post, @post, :validations => true) do |f| end
    end
  end

  def test_form_for_with_existing_object_legacy
    form_for(@post) do |f| end

    expected = whole_form("/posts/123", "edit_post_123", "edit_post", "put")
    assert_equal expected, output_buffer
  end

  def test_form_for_client_side_validations_with_existing_object
    form_for(@post, :validations => true) do |f| end

    expected = whole_form("/posts/123", "edit_post_123", "edit_post", :method => "put", :csv => "post_123")
    expected << %{<script type="text/javascript">}
    expected << %{var post_123ValidationRules={"first_name":{"presence":{"message":"can't be blank"}}}}
    expected << %{</script>}
    assert_equal expected, output_buffer
  end

  def test_form_for_with_new_object
    post = Post.new
    post.persisted = false
    def post.id() nil end

    form_for(post) do |f| end

    expected = whole_form("/posts", "new_post", "new_post")
    assert_equal expected, output_buffer
  end

  def test_form_for_client_side_validations_with_new_object
    post = Post.new
    post.persisted = false
    def post.id() nil end

    form_for(post, :validations => true) do |f| end

    expected = whole_form("/posts", "new_post", "new_post", :csv => "new_post")
    expected << %{<script type="text/javascript">}
    expected << %{var new_postValidationRules={"first_name":{"presence":{"message":"can't be blank"}}}}
    expected << %{</script>}
    assert_equal expected, output_buffer
  end

  def test_form_for_with_existing_object_in_list_legacy
    @comment.save
    form_for([@post, @comment]) {}

    expected = whole_form(comment_path(@post, @comment), "edit_comment_1", "edit_comment", "put")
    assert_dom_equal expected, output_buffer
  end

  def test_form_for_client_side_validations_with_existing_object_in_list_legacy
    @comment.save
    form_for([@post, @comment], :validations => true) {}

    expected = whole_form(comment_path(@post, @comment), "edit_comment_1", "edit_comment", :method => "put", :csv => "comment_1")
    expected << %{<script type="text/javascript">}
    expected << %{var comment_1ValidationRules={"first_name":{"presence":{"message":"can't be blank"}}}}
    expected << %{</script>}
    assert_dom_equal expected, output_buffer
  end

  def test_form_for_with_new_object_in_list_legacy
    form_for([@post, @comment]) {}

    expected = whole_form(comments_path(@post), "new_comment", "new_comment")
    assert_dom_equal expected, output_buffer
  end

  def test_form_for_client_side_validations_with_new_object_in_list_legacy
    form_for([@post, @comment], :validations => true) {}

    expected = whole_form(comments_path(@post), "new_comment", "new_comment", :csv => "new_comment")
    expected << %{<script type="text/javascript">}
    expected << %{var new_commentValidationRules={"first_name":{"presence":{"message":"can't be blank"}}}}
    expected << %{</script>}
    assert_dom_equal expected, output_buffer
  end

  def test_form_for_with_existing_object_and_namespace_in_list_legacy
    @comment.save
    form_for([:admin, @post, @comment]) {}

    expected = whole_form(admin_comment_path(@post, @comment), "edit_comment_1", "edit_comment", "put")
    assert_dom_equal expected, output_buffer
  end

  def test_form_for_client_side_validations_with_existing_object_and_namespace_in_list_legacy
    @comment.save
    form_for([:admin, @post, @comment], :validations => true) {}

    expected = whole_form(admin_comment_path(@post, @comment), "edit_comment_1", "edit_comment", :method => "put", :csv => "comment_1")
    expected << %{<script type="text/javascript">}
    expected << %{var comment_1ValidationRules={"first_name":{"presence":{"message":"can't be blank"}}}}
    expected << %{</script>}
    assert_dom_equal expected, output_buffer
  end

  def test_form_for_with_new_object_and_namespace_in_list_legacy
    form_for([:admin, @post, @comment]) {}

    expected = whole_form(admin_comments_path(@post), "new_comment", "new_comment")
    assert_dom_equal expected, output_buffer
  end

  def test_form_client_side_validations_for_with_new_object_and_namespace_in_list_legacy
    form_for([:admin, @post, @comment], :validations => true) {}

    expected = whole_form(admin_comments_path(@post), "new_comment", "new_comment", :csv => "new_comment")
    expected << %{<script type="text/javascript">}
    expected << %{var new_commentValidationRules={"first_name":{"presence":{"message":"can't be blank"}}}}
    expected << %{</script>}
    assert_dom_equal expected, output_buffer
  end
end


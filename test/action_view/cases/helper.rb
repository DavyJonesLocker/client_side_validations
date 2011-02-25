require 'base_helper'
require 'action_view'
require 'action_view/template/handlers/erb'
require 'action_view/models'
require 'client_side_validations/action_view'

module ActionViewTestSetup

  def form_for(*)
    @output_buffer = super
  end

  def setup
    super

    # Create "label" locale for testing I18n label helpers
    I18n.backend.store_translations 'label', {
      :activemodel => {
        :attributes => {
          :post => {
            :cost => "Total cost"
          }
        }
      },
      :helpers => {
        :label => {
          :post => {
            :body => "Write entire text here"
          }
        }
      }
    }

    # Create "submit" locale for testing I18n submit helpers
    I18n.backend.store_translations 'submit', {
      :helpers => {
        :submit => {
          :create => 'Create %{model}',
          :update => 'Confirm %{model} changes',
          :submit => 'Save changes',
          :another_post => {
            :update => 'Update your %{model}'
          }
        }
      }
    }

    @post = Post.new
    @comment = Comment.new
    def @post.errors()
      Class.new{
        def [](field); field == "author_name" ? ["can't be empty"] : [] end
        def empty?() false end
        def count() 1 end
        def full_messages() [ "Author name can't be empty" ] end
      }.new
    end
    def @post.id; 123; end
    def @post.id_before_type_cast; 123; end
    def @post.to_param; '123'; end

    @post.persisted   = true
    @post.title       = "Hello World"
    @post.author_name = ""
    @post.body        = "Back to the hill and over it again!"
    @post.secret      = 1
    @post.written_on  = Date.new(2004, 6, 15)
  end

  def url_for(object)
    @url_for_options = object
    if object.is_a?(Hash)
      "http://www.example.com"
    else
      super
    end
  end

  def snowman(method = nil)
    txt =  %{<div style="margin:0;padding:0;display:inline">}
    txt << %{<input name="utf8" type="hidden" value="&#x2713;" />}
    txt << %{<input name="_method" type="hidden" value="#{method}" />} if method
    txt << %{</div>}
  end

  def form_text(action = "http://www.example.com", id = nil, html_class = nil, remote = nil, validate = nil)
    txt =  %{<form accept-charset="UTF-8" action="#{action}"}
    txt << %{ data-remote="true"} if remote
    txt << %{ class="#{html_class}"} if html_class
    txt << %{ data-validate="true"} if validate
    txt << %{ id="#{id}"} if id
    txt << %{ method="post">}
  end

  def whole_form(action = "http://www.example.com", id = nil, html_class = nil, options = nil)
    contents = block_given? ? yield : ""

    if options.is_a?(Hash)
      method, remote, validate = options.values_at(:method, :remote, :validate)
    else
      method = options
    end

    form_text(action, id, html_class, remote, validate) + snowman(method) + contents + "</form>"
  end

  protected
    def comments_path(post)
      "/posts/#{post.id}/comments"
    end
    alias_method :post_comments_path, :comments_path

    def comment_path(post, comment)
      "/posts/#{post.id}/comments/#{comment.id}"
    end
    alias_method :post_comment_path, :comment_path

    def admin_comments_path(post)
      "/admin/posts/#{post.id}/comments"
    end
    alias_method :admin_post_comments_path, :admin_comments_path

    def admin_comment_path(post, comment)
      "/admin/posts/#{post.id}/comments/#{comment.id}"
    end
    alias_method :admin_post_comment_path, :admin_comment_path

    def posts_path
      "/posts"
    end

    def post_path(post, options = {})
      if options[:format]
        "/posts/#{post.id}.#{options[:format]}"
      else
        "/posts/#{post.id}"
      end
    end

    def protect_against_forgery?
      false
    end

end

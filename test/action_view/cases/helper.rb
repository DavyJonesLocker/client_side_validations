require 'base_helper'
require 'action_view'
require 'action_view/template'
require 'action_view/models'
require 'client_side_validations/action_view'

module ActionController
  class Base
    include ActionDispatch::Routing::RouteSet.new.url_helpers
  end
end

module ActionViewTestSetup
  include ::ClientSideValidations::ActionView::Helpers::FormHelper
  include ::ClientSideValidations::ActionView::Helpers::FormTagHelper

  def form_for(*)
    @output_buffer = super
  end

  Routes = ActionDispatch::Routing::RouteSet.new
  include Routes.url_helpers
  def _routes
    Routes
  end

  Routes.draw do
    resources :posts do
      resources :comments
    end

    root to: 'main#index'
  end

  def default_url_options
    { only_path: true }
  end

  def url_for(object)
    @url_for_options = object
    if object.is_a?(Hash) && object[:use_route].blank? && object[:controller].blank?
      object.merge!(controller: "main", action: "index")
    end
    super
  end

  def hidden_input_for_select(name)
    %{<input name="#{name}" type="hidden" value="" />}
  end

  def setup
    super

    # Create 'label' locale for testing I18n label helpers
    I18n.backend.store_translations 'label', {
      activemodel: {
        attributes: {
          post: {
            cost: 'Total cost'
          }
        }
      },
      helpers: {
        label: {
          post: {
            body: 'Write entire text here'
          }
        }
      }
    }

    # Create "submit" locale for testing I18n submit helpers
    I18n.backend.store_translations 'submit', {
      helpers: {
        submit: {
          create: 'Create %{model}',
          update: 'Confirm %{model} changes',
          submit: 'Save changes',
          another_post: {
            update: 'Update your %{model}'
          }
        }
      }
    }

    @post = Post.new
    @comment = Comment.new

    if defined?(ActionView::OutputFlow)
      @view_flow        = ActionView::OutputFlow.new
    else
      @_content_for     = Hash.new { |h,k| h[k] = ActiveSupport::SafeBuffer.new }
    end
  end

  def snowman(method = nil)
    txt =
      if Rails.version.starts_with?('4.0')
        %{<div style="margin:0;padding:0;display:inline">}
      elsif Rails.version.starts_with?('4.1')
        %{<div style="display:none">}
      else
        ''
      end
    txt << %{<input name="utf8" type="hidden" value="&#x2713;" />}
    txt << %{<input type="hidden" name="_method" value="#{method}" />} if method
    txt << %{</div>} unless Rails.version.starts_with?('4.2')
    txt
  end

  def form_text(action = "http://www.example.com", id = nil, html_class = nil, remote = nil, validators = nil, file = nil, custom_id = false)
    txt =  %{<form action="#{action}" accept-charset="UTF-8" method="post"}
    txt << %{ data-validate="true"} if validators
    txt << %{ id="#{id}"} if id && custom_id
    txt << %{ novalidate="novalidate"} if validators
    txt << %{ class="#{html_class}"} if html_class
    txt << %{ id="#{id}"} if id && !custom_id
    txt << %{ enctype="multipart/form-data"} if file
    txt << %{>}
  end

  def form_field(tag, id = nil, name = nil, type = nil, value = nil, multiple = false, tag_content = nil, custom_name = nil)
    txt =  %{<#{tag}}
    txt << %{ name="#{custom_name}"} if custom_name
    txt << %{ type="#{type}"} if type
    txt << %{ value="#{value}"} if value
    txt << %{ multiple="multiple"} if multiple
    txt << %{ name="#{name}"} if name
    txt << %{ id="#{id}"} if id
    txt <<
       if %w(select textarea).include?(tag)
         %{>#{tag_content}</#{tag}>}
       else
         %{ />}
       end
  end

  def whole_form(action = "http://www.example.com", id = nil, html_class = nil, options = nil)
    contents = block_given? ? yield : ""

    if options.is_a?(Hash)
      method, remote, validators, file, custom_id, no_validate = options.values_at(:method, :remote, :validators, :file, :custom_id, :no_validate)
    else
      method = options
    end

    html = form_text(action, id, html_class, remote, (validators || no_validate), file, custom_id) + snowman(method) + (contents || "") + "</form>"

    if options.is_a?(Hash) && options[:validators]
      build_script_tag(html, id, options[:validators])
    else
      html
    end
  end

  def build_script_tag(html, id, validators)
    number_format = {separator: '.', delimiter: ','}
    patterns = {numericality:"/^(-|\\+)?(?:\\d+|\\d{1,3}(?:\\#{number_format[:delimiter]}\\d{3})+)(?:\\#{number_format[:separator]}\\d*)?$/"}
    (html || '') + %Q{<script>//<![CDATA[\nif(window.ClientSideValidations===undefined)window.ClientSideValidations={};window.ClientSideValidations.disabled_validators=#{ClientSideValidations::Config.disabled_validators.to_json};window.ClientSideValidations.number_format=#{number_format.to_json};if(window.ClientSideValidations.patterns===undefined)window.ClientSideValidations.patterns = {};window.ClientSideValidations.patterns.numericality=#{patterns[:numericality]};if(window.ClientSideValidations.forms===undefined)window.ClientSideValidations.forms={};window.ClientSideValidations.forms['#{id}'] = #{client_side_form_settings_helper.merge(validators: validators).to_json};\n//]]></script>}
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

    def posts_path(options={})
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

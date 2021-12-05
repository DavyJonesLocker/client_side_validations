# frozen_string_literal: true

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

  BASE_FIELD_HELPERS = {
    color_field:          { type: 'color', html_options: { value: '#000000' } },
    date_field:           { type: 'date' },
    datetime_field:       { type: 'datetime-local' },
    datetime_local_field: { type: 'datetime-local' },
    email_field:          { type: 'email' },
    month_field:          { type: 'month' },
    number_field:         { type: 'number' },
    password_field:       { type: 'password' },
    phone_field:          { type: 'tel' },
    range_field:          { type: 'range' },
    search_field:         { type: 'search' },
    telephone_field:      { type: 'tel' },
    text_field:           { type: 'text' },
    time_field:           { type: 'time' },
    url_field:            { type: 'url' },
    week_field:           { type: 'week' }
  }.freeze

  def form_for(*, **)
    @output_buffer = super
  end

  def form_with(*, **)
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

    resources :format_things

    root to: 'main#index'
  end

  def default_url_options
    { only_path: true }
  end

  def url_for(object)
    @url_for_options = object
    if object.is_a?(Hash) && object[:use_route].blank? && object[:controller].blank?
      object[:controller] = 'main'
      object[:action] = 'index'
    end
    super
  end

  def autocomplete_attribute
    @autocomplete_attribute ||=
      if hidden_field_tag(:test).include?('autocomplete')
        'autocomplete="off"'
      else
        ''
      end
  end

  def hidden_input_for_select(name)
    %(<input name="#{name}" type="hidden" value="" #{autocomplete_attribute} />)
  end

  def hidden_input_for_checkbox(name)
    %(<input name="#{name}" type="hidden" value="0" #{autocomplete_attribute} />)
  end

  def setup
    super

    # Create 'label' locale for testing I18n label helpers
    label_translations = {
      activemodel: {
        attributes: {
          post: {
            cost: 'Total cost'
          }
        }
      },
      helpers:     {
        label: {
          post: {
            body: 'Write entire text here'
          }
        }
      }
    }
    I18n.backend.store_translations 'label', label_translations

    # Create "submit" locale for testing I18n submit helpers
    submit_translations = {
      helpers: {
        submit: {
          create:       'Create %{model}',
          update:       'Confirm %{model} changes',
          submit:       'Save changes',
          another_post: {
            update: 'Update your %{model}'
          }
        }
      }
    }
    I18n.backend.store_translations 'submit', submit_translations

    @post = Post.new
    @comment = Comment.new
    @format_thing = FormatThing.new

    if defined?(ActionView::OutputFlow)
      @view_flow = ActionView::OutputFlow.new
    else
      @_content_for = Hash.new { |h, k| h[k] = ActiveSupport::SafeBuffer.new }
    end
  end

  def snowman(method = nil)
    txt = +''

    txt << %(<input name="utf8" type="hidden" value="&#x2713;" />) if default_enforce_utf8

    txt << %(<input type="hidden" name="_method" value="#{method}" #{autocomplete_attribute} />) if method

    txt
  end

  def form_field(tag, id: nil, name: nil, type: nil, value: nil, multiple: false, tag_content: nil, custom_name: nil)
    txt = +%(<#{tag})

    txt << %( name="#{custom_name}") if custom_name
    txt << %( type="#{type}") if type
    txt << %( #{autocomplete_attribute}) if %w[hidden].include?(type)
    txt << %( value="#{value}") if value
    txt << %( multiple="multiple") if multiple
    txt << %( name="#{name}") if name
    txt << %( id="#{id}") if id
    txt <<
      if %w[select textarea].include?(tag)
        %(\>#{tag_content}</#{tag}>)
      else
        %( />)
      end

    txt
  end

  def form_for_text(action = 'http://www.example.com', id = nil, html_class = nil, remote = nil, validators = nil, file = nil, custom_id: false)
    txt = +%(<form action="#{action}" accept-charset="UTF-8" method="post")

    if validators
      txt << %( data-client-side-validations="#{CGI.escapeHTML(csv_data_attribute(validators))}")
      txt << %( novalidate="novalidate") if validators
    end

    txt << %( data-remote="true") if remote
    txt << %( id="#{id}") if id && custom_id
    txt << %( class="#{html_class}") if html_class
    txt << %( id="#{id}") if id && !custom_id
    txt << %( enctype="multipart/form-data") if file
    txt << %(\>)

    txt
  end

  def whole_form_for(action = 'http://www.example.com', id = nil, html_class = nil, options = nil)
    contents = block_given? ? yield : ''

    if options.is_a?(Hash)
      method, remote, validators, file, custom_id, no_validate = options.values_at(:method, :remote, :validators, :file, :custom_id, :no_validate)
    else
      method = options
    end

    form_for_text(action, id, html_class, remote, (validators || no_validate), file, custom_id: custom_id) + snowman(method) + (contents || '') + '</form>'
  end

  def form_with_text(action = 'http://www.example.com', id = nil, html_class = nil, local = nil, validators = nil, file = nil, custom_id: false)
    txt = +%(<form action="#{action}" accept-charset="UTF-8" method="post")

    if validators
      txt << %( data-client-side-validations="#{CGI.escapeHTML(csv_data_attribute(validators))}")
      txt << %( novalidate="novalidate") if validators
    end

    txt << %( id="#{id}") if id && custom_id
    txt << %( data-remote="true") if !local && form_with_generates_remote_forms
    txt << %( id="#{id}") if id && !custom_id
    txt << %( class="#{html_class}") if html_class
    txt << %( enctype="multipart/form-data") if file
    txt << %(\>)

    txt
  end

  def whole_form_with(action = 'http://www.example.com', options = nil)
    contents = block_given? ? yield : ''

    if options.is_a?(Hash)
      method, local, validators, file, custom_id, id, html_class, no_validate = options.values_at(:method, :local, :validators, :file, :custom_id, :id, :class, :no_validate)
    else
      method = options
    end

    form_with_text(action, id, html_class, local, (validators || no_validate), file, custom_id: custom_id) + snowman(method) + (contents || '') + '</form>'
  end

  def client_side_form_settings_helper
    {
      type:      'ActionView::Helpers::FormBuilder',
      input_tag: %(<span id="input_tag"></span>),
      label_tag: %(<label id="label_tag"></label>)
    }
  end

  def csv_data_attribute(validators)
    {
      html_settings: client_side_form_settings_helper,
      number_format: { separator: '.', delimiter: ',' },
      validators:    validators
    }.to_json
  end

  def comments_path(post)
    "/posts/#{post.id}/comments"
  end
  alias post_comments_path comments_path

  def comment_path(post, comment)
    "/posts/#{post.id}/comments/#{comment.id}"
  end
  alias post_comment_path comment_path

  def admin_comments_path(post)
    "/admin/posts/#{post.id}/comments"
  end
  alias admin_post_comments_path admin_comments_path

  def admin_comment_path(post, comment)
    "/admin/posts/#{post.id}/comments/#{comment.id}"
  end
  alias admin_post_comment_path admin_comment_path

  def posts_path(*)
    '/posts'
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

  # Rails 5.x does not define `ActionView::Helpers::FormTagHelper::form_with_generates_ids`
  # Default value was `true`
  def default_enforce_utf8
    if ActionView::Helpers::FormTagHelper.respond_to?(:default_enforce_utf8)
      ActionView::Helpers::FormTagHelper.default_enforce_utf8
    else
      true
    end
  end

  def form_with_generates_remote_forms
    ActionView::Helpers::FormHelper.form_with_generates_remote_forms
  end
end

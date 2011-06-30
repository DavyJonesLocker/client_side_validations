module ClientSideValidations::ActionView
  module Helpers
  end
end

require 'client_side_validations/core_ext'
require 'client_side_validations/action_view/form_helper'
require 'client_side_validations/action_view/form_tag_helper'
require 'client_side_validations/action_view/form_builder'

ActionView::Base.send(:include, ClientSideValidations::ActionView::Helpers::FormHelper)
ActionView::Base.send(:include, ClientSideValidations::ActionView::Helpers::FormTagHelper)
ActionView::Helpers::FormBuilder.send(:include, ClientSideValidations::ActionView::Helpers::FormBuilder)


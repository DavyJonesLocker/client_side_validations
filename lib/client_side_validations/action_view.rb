module ClientSideValidations::ActionView
  module Helpers
  end
end

require "client_side_validations/action_view/form_helper"
require "client_side_validations/action_view/form_tag_helper"

ActionView::Helpers.send(:include, ClientSideValidations::ActionView::Helpers::FormHelper)
ActionView::Helpers.send(:include, ClientSideValidations::ActionView::Helpers::FormTagHelper)
ActionView::Helpers::FormBuilder.send(:include, ClientSideValidations::ActionView::Helpers::FormBuilder)


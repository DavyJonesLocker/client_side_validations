module ClientSideValidations::ActionView
  module Helpers
  end
end

%w{form_helper form_tag_helper}.each do |helper|
  require "client_side_validations/action_view/#{helper}"
  helper = helper.camelize
  ActionView::Helpers.send(:include, eval("ClientSideValidations::ActionView::Helpers::#{helper}"))
end


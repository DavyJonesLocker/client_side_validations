# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
    end
  end
end

require 'client_side_validations/core_ext'
require 'client_side_validations/action_view/form_helper'

if ActionView::Helpers::FormHelper.method_defined?(:form_with)
  require 'client_side_validations/action_view/form_with_helper'
end

require 'client_side_validations/action_view/form_builder'

ActionView::Base.send(:include, ClientSideValidations::ActionView::Helpers::FormHelper)
ActionView::Helpers::FormBuilder.send(:prepend, ClientSideValidations::ActionView::Helpers::FormBuilder)

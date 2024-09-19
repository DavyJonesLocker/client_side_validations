# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
    end
  end
end

require_relative 'core_ext'
require_relative 'action_view/form_helper'

if ActionView::Helpers::FormHelper.method_defined?(:form_with)
  require_relative 'action_view/form_with_helper'
end

require_relative 'action_view/form_builder'

ActiveSupport.on_load(:action_view) { include ClientSideValidations::ActionView::Helpers::FormHelper }
ActionView::Helpers::FormBuilder.prepend ClientSideValidations::ActionView::Helpers::FormBuilder

module ClientSideValidations
  module Config
    class << self
      attr_accessor :uniqueness_validator_disabled
      @uniqueness_validator_disabled = false
    end
  end
end

require 'client_side_validations/active_model'  if defined?(::ActiveModel)
require 'client_side_validations/active_record' if defined?(::ActiveRecord)
require 'client_side_validations/action_view'   if defined?(::ActionView)
if defined?(::Rails)
  require 'client_side_validations/generators'
  require 'client_side_validations/middleware'
  require 'client_side_validations/engine'
end


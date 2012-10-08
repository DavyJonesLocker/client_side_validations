module ClientSideValidations
end

require 'client_side_validations/config'
require 'client_side_validations/active_model'  if defined?(::ActiveModel)
require 'client_side_validations/active_record' if defined?(::ActiveRecord)
require 'client_side_validations/action_view'   if defined?(::ActionView)
if defined?(::Rails)
  require 'client_side_validations/generators'
  require 'client_side_validations/middleware'
  require 'client_side_validations/engine'
end


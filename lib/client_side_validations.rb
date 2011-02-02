module ClientSideValidations
end

require 'client_side_validations/active_record' if defined?(ActiveRecord)
require 'client_side_validations/mongoid' if defined?(Mongoid)


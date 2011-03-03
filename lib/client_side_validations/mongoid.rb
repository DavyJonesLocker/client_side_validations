require 'client_side_validations/active_model'
require 'client_side_validations/mongoid/middleware'

%w{uniqueness}.each do |validator|
  require "client_side_validations/mongoid/#{validator}"
  validator.capitalize!
  eval "Mongoid::Validations::#{validator}Validator.send(:include, ClientSideValidations::Mongoid::#{validator})"
end


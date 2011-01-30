require 'client_side_validations/active_model'

%w{uniqueness}.each do |validator|
  require "client_side_validations/mongoid/#{validator}"
  eval "Mongoid::Validations::#{validator.capitalize}Validator.send(:include, ClientSideValidations::Mongoid::#{validator.capitalize})"
end


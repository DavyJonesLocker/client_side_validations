require 'client_side_validations/active_model'

%w{uniqueness}.each do |validator|
  require "client_side_validations/active_record/#{validator}"
  validator.capitalize!
  eval "ActiveRecord::Validations::#{validator}Validator.send(:include, ClientSideValidations::ActiveRecord::#{validator})"
end

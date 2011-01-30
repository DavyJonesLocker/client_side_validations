require 'client_side_validations/active_model'

%w{uniqueness}.each do |validator|
  require "client_side_validations/active_record/#{validator}"
  eval "ActiveRecord::Validations::#{validator.capitalize}Validator.send(:include, ClientSideValidations::ActiveRecord::#{validator.capitalize})"
end

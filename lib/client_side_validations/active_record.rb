require 'client_side_validations/active_model'
require 'client_side_validations/middleware'
require 'client_side_validations/active_record/middleware'

%w(uniqueness).each do |validator|
  require "client_side_validations/active_record/#{validator}"
  validator.capitalize!
  ActiveRecord::Validations.const_get("#{validator}Validator").send :include, ClientSideValidations::ActiveRecord.const_get(validator)
end

ActiveRecord::Base.send(:include, ClientSideValidations::ActiveModel::Validations)
ClientSideValidations::Middleware::Uniqueness.register_orm(ClientSideValidations::ActiveRecord::Middleware)

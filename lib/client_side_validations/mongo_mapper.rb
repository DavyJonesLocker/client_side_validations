require 'client_side_validations/active_model'
require 'client_side_validations/mongo_mapper/middleware'

%w{uniqueness}.each do |validator|
  require "client_side_validations/mongo_mapper/#{validator}"
  validator.capitalize!
  eval "MongoMapper::Plugins::Validations::#{validator}Validator.send(:include, ClientSideValidations::MongoMapper::#{validator})"
end


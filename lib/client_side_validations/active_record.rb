require 'client_side_validations/active_model'
require 'client_side_validations/extender'
require 'client_side_validations/middleware'
require 'client_side_validations/active_record/middleware'

ActiveRecord::Base.send(:include, ClientSideValidations::ActiveModel::Validations)
ClientSideValidations::Middleware::Uniqueness.register_orm(ClientSideValidations::ActiveRecord::Middleware)

ClientSideValidations::Extender.extend 'ActiveRecord', %w(Uniqueness)

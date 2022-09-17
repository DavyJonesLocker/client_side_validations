# frozen_string_literal: true

require 'client_side_validations/active_model'
require 'client_side_validations/extender'

ActiveSupport.on_load(:active_record) { include ClientSideValidations::ActiveModel::Validations }

ClientSideValidations::Extender.extend 'ActiveRecord', %w[Uniqueness]

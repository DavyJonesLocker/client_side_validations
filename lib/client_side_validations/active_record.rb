# frozen_string_literal: true

require_relative 'active_model'

ActiveSupport.on_load(:active_record) { include ClientSideValidations::ActiveModel::Validations }

ClientSideValidations::Extender.extend 'ActiveRecord', %w[Uniqueness]

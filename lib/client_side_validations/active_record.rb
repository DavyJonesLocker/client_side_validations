# frozen_string_literal: true

require 'client_side_validations/active_model'
require 'client_side_validations/extender'

ActiveRecord::Base.send(:include, ClientSideValidations::ActiveModel::Validations)

ClientSideValidations::Extender.extend 'ActiveRecord', %w[Uniqueness]

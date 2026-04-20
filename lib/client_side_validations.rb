# frozen_string_literal: true

require_relative 'client_side_validations/config'
require_relative 'client_side_validations/active_model'  if defined?(ActiveModel)
require_relative 'client_side_validations/active_record' if defined?(ActiveRecord)
require_relative 'client_side_validations/action_view'   if defined?(ActionView)

require_relative 'client_side_validations/engine' if defined?(Rails)

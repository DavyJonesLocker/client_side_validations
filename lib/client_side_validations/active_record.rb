# frozen_string_literal: true

require 'client_side_validations/active_model'
require 'client_side_validations/extender'

ActiveRecord::Base.send(:include, ClientSideValidations::ActiveModel::Validations)

# rubocop:disable Style/MixinGrouping
ClientSideValidations::Extender.extend 'ActiveRecord', %w(Uniqueness)
# rubocop:enable Style/MixinGrouping

# frozen_string_literal: true

module ClientSideValidations
  module Config
    class << self
      attr_accessor :disabled_validators, :number_format_with_locale, :root_path, :stimulus_controller_name
    end

    self.disabled_validators = []
    self.number_format_with_locale = false
    self.root_path = nil
    self.stimulus_controller_name = 'client-side-validations'
  end
end

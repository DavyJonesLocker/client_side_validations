# frozen_string_literal: true

module ClientSideValidations
  module Config
    class << self
      attr_accessor :disabled_validators
      attr_accessor :number_format_with_locale
      attr_accessor :allow_delimiters_in_numbers
      attr_accessor :root_path
    end

    self.disabled_validators = []
    self.number_format_with_locale = false
    self.allow_delimiters_in_numbers = false
    self.root_path = nil
  end
end

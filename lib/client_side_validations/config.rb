module ClientSideValidations
  module Config
    class << self
      attr_accessor :disabled_validators
      attr_accessor :number_format_with_locale
    end

    self.disabled_validators = []
    self.number_format_with_locale = false
  end
end

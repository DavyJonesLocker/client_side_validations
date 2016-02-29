module ClientSideValidations
  module Config
    class << self
      attr_accessor :disabled_validators
      attr_accessor :number_format_with_locale
      attr_accessor :root_path
      attr_accessor :show_error_field
    end

    self.show_error_field = false
    self.disabled_validators = []
    self.number_format_with_locale = false
    self.root_path = nil
  end
end

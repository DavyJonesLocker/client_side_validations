module ClientSideValidations
  module Config
    class << self
      attr_accessor :disabled_validators
    end

    self.disabled_validators = []
  end
end

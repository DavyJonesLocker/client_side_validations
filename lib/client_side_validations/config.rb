module ClientSideValidations
  module Config
    class << self
      attr_accessor :uniqueness_validator_disabled
      @uniqueness_validator_disabled = false
    end
  end
end

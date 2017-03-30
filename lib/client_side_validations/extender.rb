# frozen_string_literal: true

module ClientSideValidations
  module Extender
    module_function

    def extend(klass, validators)
      validators.each do |validator|
        require "client_side_validations/#{klass.underscore}/#{validator.downcase}"
        const_get(klass)::Validations.const_get("#{validator}Validator").send :include, ClientSideValidations.const_get(klass).const_get(validator)
      end
    end
  end
end

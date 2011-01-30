module ClientSideValidations
  module ActiveModel
    module Validator
      def message_types
        [kind]
      end
    end
  end
end

ActiveModel::Validator.send(:include, ClientSideValidations::ActiveModel::Validator)

%w{format presence}.each do |validator|
  require "client_side_validations/active_model/#{validator}"
  eval "ActiveModel::Validations::#{validator.capitalize}Validator.send(:include, ClientSideValidations::ActiveModel::#{validator.capitalize})"
end

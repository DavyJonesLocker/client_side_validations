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
  validator.capitalize!
  eval "ActiveModel::Validations::#{validator}Validator.send(:include, ClientSideValidations::ActiveModel::#{validator})"
end

module ClientSideValidations
  module ActiveModel
    module Validator

      def client_side_hash(model, attribute)
        extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS)
        { :message => model.errors.generate_message(attribute, message_types.first, extra_options) }.merge(extra_options)
      end

      private

      def message_types
        [kind]
      end
    end

    module Validations
      def client_side_validation_hash
        _validators.inject({}) do |attr_hash, attr|
          
          validator_hash = attr[1].inject({}) do |kind_hash, validator|
            kind_hash.merge!(validator.kind => validator.client_side_hash(self, attr[0]))
          end

          attr_hash.merge!(attr[0] => validator_hash)
        end
      end
    end
  end
end

ActiveModel::Validator.send(:include, ClientSideValidations::ActiveModel::Validator)
ActiveModel::Validations.send(:include, ClientSideValidations::ActiveModel::Validations)

%w{acceptance format presence}.each do |validator|
  require "client_side_validations/active_model/#{validator}"
  validator.capitalize!
  eval "ActiveModel::Validations::#{validator}Validator.send(:include, ClientSideValidations::ActiveModel::#{validator})"
end


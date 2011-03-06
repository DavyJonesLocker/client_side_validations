require 'client_side_validations/core_ext'

module ClientSideValidations::ActiveModel
  module Validator

    def client_side_hash(model, attribute)
      extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS - [:on, :allow_blank])
      { :message => model.errors.generate_message(attribute, message_type, extra_options) }.merge(extra_options)
    end

    private

    def message_type
      kind
    end
  end

  module Validations
    def client_side_validation_hash
      _validators.inject({}) do |attr_hash, attr|

        validator_hash = attr[1].inject({}) do |kind_hash, validator|
          client_side_hash = validator.client_side_hash(self, attr[0])
          if (client_side_hash[:on] == self.validation_context || client_side_hash[:on].nil?)
            kind_hash.merge!(validator.kind => client_side_hash.except(:on))
          else
            kind_hash.merge!({})
          end
        end

        attr_hash.merge!(attr[0] => validator_hash)
      end.delete_if { |key, value| value.blank? }
    end
  end
end

ActiveModel::Validator.send(:include, ClientSideValidations::ActiveModel::Validator)
ActiveModel::Validations.send(:include, ClientSideValidations::ActiveModel::Validations)

%w{acceptance length format numericality presence}.each do |validator|
  require "client_side_validations/active_model/#{validator}"
  validator.capitalize!
  eval "ActiveModel::Validations::#{validator}Validator.send(:include, ClientSideValidations::ActiveModel::#{validator})"
end


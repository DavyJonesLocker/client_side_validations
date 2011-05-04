require 'client_side_validations/core_ext'

module ClientSideValidations::ActiveModel
  module Validator

    def client_side_hash(model, attribute)
      extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS - [:allow_blank])
      { :message => model.errors.generate_message(attribute, message_type, extra_options) }.merge(extra_options)
    end

    private

    def message_type
      kind
    end
  end

  module Validations
    def client_side_validation_hash
      @client_side_validation_hash ||= _validators.inject({}) do |attr_hash, attr|
        unless [nil, :block].include?(attr[0])

          validator_hash = attr[1].inject({}) do |kind_hash, validator|
            client_side_hash = validator.client_side_hash(self, attr[0])
            # Yeah yeah, #new_record? is not part of ActiveModel :p
            if (can_use_for_client_side_validation?(client_side_hash, validator))
              kind_hash.merge!(validator.kind => client_side_hash.except(:on))
            else
              kind_hash.merge!({})
            end
          end

          if validator_hash.present?
            attr_hash.merge!(attr[0] => validator_hash)
          else
            attr_hash
          end
        else
          attr_hash
        end
      end
    end

    private

    def can_use_for_client_side_validation?(client_side_hash, validator)
      ((self.respond_to?(:new_record?) && validator.options[:on] == (self.new_record? ? :create : :update)) || validator.options[:on].nil?) && !validator.options.key?(:if) && !validator.options.key?(:unless) && validator.kind != :block
    end
  end
end

ActiveModel::Validator.send(:include, ClientSideValidations::ActiveModel::Validator)
ActiveModel::Validations.send(:include, ClientSideValidations::ActiveModel::Validations)

%w{acceptance exclusion inclusion length format numericality presence}.each do |validator|
  require "client_side_validations/active_model/#{validator}"
  validator.capitalize!
  eval "ActiveModel::Validations::#{validator}Validator.send(:include, ClientSideValidations::ActiveModel::#{validator})"
end


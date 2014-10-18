require 'client_side_validations/core_ext'

module ClientSideValidations::ActiveModel
  module Validator

    def client_side_hash(model, attribute, force = nil)
      build_client_side_hash(model, attribute, self.options.dup)
    end

    def copy_conditional_attributes(to, from)
      [:if, :unless].each { |key| to[key] = from[key] if from[key].present? }
    end

    private

    def build_client_side_hash(model, attribute, options)
      { :message => model.errors.generate_message(attribute, message_type, options) }.merge(options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS - [:allow_blank, :if, :unless]))
    end

    def message_type
      kind
    end
  end

  module Validations
    def client_side_validation_hash(force = nil)
      _validators.inject({}) do |attr_hash, attr|
        unless [nil, :block].include?(attr[0])

          validator_hash = attr[1].inject(Hash.new { |h,k| h[k] = []}) do |kind_hash, validator|
            if can_use_for_client_side_validation?(attr[0], validator, force)
              if client_side_hash = validator.client_side_hash(self, attr[0], extract_force_option(attr[0], force))
                kind_hash[validator.kind] << client_side_hash.except(:on, :if, :unless)
              end
            end

            kind_hash
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

    def extract_force_option(attr, force)
      case force
      when FalseClass, TrueClass, NilClass
        force
      when Hash
        extract_force_option(nil, force[attr])
      else
        nil
      end
    end

    def can_use_for_client_side_validation?(attr, validator, force)
      if validator_turned_off?(attr, validator, force)
        result = false
      else
        # Yeah yeah, #new_record? is not part of ActiveModel :p
        result = ((self.respond_to?(:new_record?) && validator.options[:on] == (self.new_record? ? :create : :update)) || validator.options[:on].nil?)
        result = result && validator.kind != :block

        if validator.options[:if] || validator.options[:unless]
          if validator.options[:if] && validator.options[:if] =~ /changed\?/
            result = true
          else result = can_force_validator?(attr, validator, force)
            if validator.options[:if]
              result = result && run_conditional(validator.options[:if])
            end
            if validator.options[:unless]
              result = result && !run_conditional(validator.options[:unless])
            end
          end
        end
      end

      result
    end

    def run_conditional(method_name_value_or_proc)
      if method_name_value_or_proc.respond_to?(:call)
        method_name_value_or_proc.call(self)
      else
        self.send(method_name_value_or_proc)
      end
    end

    def validator_turned_off?(attr, validator, force)
      case force
      when FalseClass
        true
      when Hash
        case force[attr]
        when FalseClass
          true
        when Hash
          force[attr][validator.kind] == false
        else
          false
        end
      else
        ::ClientSideValidations::Config.disabled_validators.include?(validator.kind)
      end
    end

    def can_force_validator?(attr, validator, force)
      case force
      when TrueClass
        true
      when Hash
        case force[attr]
        when TrueClass
          true
        when Hash
          force[attr][validator.kind]
        else
          false
        end
      else
        false
      end
    end
  end
end

ActiveModel::Validator.send(:include, ClientSideValidations::ActiveModel::Validator)
ActiveModel::Validations.send(:include, ClientSideValidations::ActiveModel::Validations)

%w{absence acceptance exclusion inclusion length format numericality presence}.each do |validator|
  require "client_side_validations/active_model/#{validator}"
  validator.capitalize!
  eval "ActiveModel::Validations::#{validator}Validator.send(:include, ClientSideValidations::ActiveModel::#{validator})"
end


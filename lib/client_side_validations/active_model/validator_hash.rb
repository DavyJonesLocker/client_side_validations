# frozen_string_literal: true

require 'client_side_validations/active_model/conditionals'

module ClientSideValidations
  module ActiveModel
    module ValidatorHash
      include ClientSideValidations::ActiveModel::Conditionals

      def extract_force_option(attr, force)
        case force
        when FalseClass, TrueClass, NilClass
          force
        when Hash
          extract_force_option(nil, force[attr])
        end
      end

      def can_use_for_client_side_validation?(attr, validator, force)
        return false if validator_turned_off?(attr, validator, force)

        if validator.options[:if] || validator.options[:unless]
          check_conditionals attr, validator, force
        else
          check_validator attr, validator, force
        end
      end

      # Yeah yeah, #new_record? is not part of ActiveModel :p
      def check_new_record(validator)
        (respond_to?(:new_record?) && validator.options[:on] == (new_record? ? :create : :update))
      end

      def check_on_context(attr, validator, force)
        return true if validator.options[:on].nil?

        case force
        when Hash
          case force[attr]
          when Hash
            force[attr][:on] == validator.options[:on]
          else
            false
          end
        else
          false
        end
      end

      def will_save_change?(options)
        options =~ /changed\?/ || options =~ /will_save_change_to/
      end

      def check_conditionals(attr, validator, force)
        return true if validator.options[:if] && will_save_change?(validator.options[:if])

        result = can_force_validator?(attr, validator, force)
        result &&= run_conditionals(validator.options[:if], :if) if validator.options[:if]
        result &&= run_conditionals(validator.options[:unless], :unless) if validator.options[:unless]

        result
      end

      def check_validator(attr, validator, force)
        result = check_new_record(validator)
        result ||= check_on_context(attr, validator, force)
        result && validator.kind != :block
      end

      def validator_turned_off?(attr, validator, force)
        return true if ::ClientSideValidations::Config.disabled_validators.include?(validator.kind)

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
          false
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
end

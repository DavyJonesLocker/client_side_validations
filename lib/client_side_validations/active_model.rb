# frozen_string_literal: true

require_relative 'core_ext'
require_relative 'extender'
require_relative 'active_model/conditionals'

module ClientSideValidations
  module ActiveModel
    module Validator
      def client_side_hash(model, attribute, _force = nil)
        build_client_side_hash(model, attribute, options.dup)
      end

      def copy_conditional_attributes(attribute_to, attribute_from)
        %i[if unless].each { |key| attribute_to[key] = attribute_from[key] if attribute_from[key].present? }
      end

      private

      def build_client_side_hash(model, attribute, options)
        # Rails mutates `options` object when calling `model.errors.generate_message`
        # by removing `message` option, if any.
        # By raising on missing translations, CSV has the same behavior across
        # all supported Rails versions and `config.i18n.raise_on_missing_translations`
        # possible configurations.
        options[:raise] = true

        message =
          begin
            model.errors.generate_message(attribute, message_type, options)
          rescue I18n::MissingTranslationData
            options[:message] = :invalid
            model.errors.generate_message(attribute, message_type, options)
          end

        options.delete(:raise)

        { message: message }.merge(options.except(*callbacks_options - %i[allow_blank if unless]))
      end

      def message_type
        kind
      end

      def callbacks_options
        ::ActiveModel::Error::CALLBACKS_OPTIONS
      end
    end

    module Validations
      include ClientSideValidations::ActiveModel::Conditionals

      ATTRIBUTES_DENYLIST = [nil, :block].freeze

      def client_side_validation_hash(force = nil)
        _validators.inject({}) do |attr_hash, attr|
          next attr_hash if ATTRIBUTES_DENYLIST.include?(attr[0])

          validator_hash = validator_hash_for(attr, force)

          if validator_hash.present?
            attr_hash.merge!(attr[0] => validator_hash)
          else
            attr_hash
          end
        end
      end

      private

      def validator_hash_for(attr, force)
        attr[1].each_with_object(Hash.new { |h, k| h[k] = [] }) do |validator, kind_hash|
          next unless can_use_for_client_side_validation?(attr[0], validator, force)

          client_side_hash = validator.client_side_hash(self, attr[0], extract_force_option(attr[0], force))
          if client_side_hash
            kind_hash[validator.kind] << client_side_hash.except(:on, :if, :unless)
          end
        end
      end

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

        result = check_new_record(validator)
        result &&= validator.kind != :block

        if validator.options[:if] || validator.options[:unless]
          check_conditionals attr, validator, force
        else
          result
        end
      end

      # Yeah yeah, #new_record? is not part of ActiveModel :p
      def check_new_record(validator)
        (respond_to?(:new_record?) && validator.options[:on] == (new_record? ? :create : :update)) || validator.options[:on].nil?
      end

      def will_save_change?(options)
        options.is_a?(Symbol) && (options.to_s.end_with?('changed?') || options.to_s.start_with?('will_save_change_to'))
      end

      def check_conditionals(attr, validator, force)
        return true if validator.options[:if] && will_save_change?(validator.options[:if])

        result = can_force_validator?(attr, validator, force)

        if validator.options[:if]
          result &&= run_conditionals(validator.options[:if], :if)
        end

        if validator.options[:unless]
          result &&= run_conditionals(validator.options[:unless], :unless)
        end

        result
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

    module EnumerableValidator
      def client_side_hash(model, attribute, force = nil)
        options = self.options.dup

        if options[:in].respond_to?(:call)
          return unless force

          options[:in] = options[:in].call(model)
        end

        hash = build_client_side_hash(model, attribute, options)

        if hash[:in].is_a?(Range)
          hash[:range] = hash[:in]
          hash.delete(:in)
        end

        hash
      end
    end
  end
end

ActiveModel::Validator.include ClientSideValidations::ActiveModel::Validator
ActiveModel::Validations.include ClientSideValidations::ActiveModel::Validations

ClientSideValidations::Extender.extend 'ActiveModel', %w[Absence Acceptance Exclusion Format Inclusion Length Numericality Presence]

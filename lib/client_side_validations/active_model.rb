# frozen_string_literal: true

require 'client_side_validations/core_ext'
require 'client_side_validations/extender'
require 'client_side_validations/active_model/validator_hash'

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
        callbacks_options =
          if Rails.version >= '6.1'
            ::ActiveModel::Error::CALLBACKS_OPTIONS
          else
            ::ActiveModel::Errors::CALLBACKS_OPTIONS
          end

        { message: model.errors.generate_message(attribute, message_type, options) }.merge(options.except(*callbacks_options - %i[allow_blank if unless]))
      end

      def message_type
        kind
      end
    end

    module Validations
      include ClientSideValidations::ActiveModel::ValidatorHash

      def client_side_validation_hash(force = nil)
        _validators.inject({}) do |attr_hash, attr|
          next attr_hash if [nil, :block].include?(attr[0])

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

ActiveModel::Validator.send(:include, ClientSideValidations::ActiveModel::Validator)
ActiveModel::Validations.send(:include, ClientSideValidations::ActiveModel::Validations)

ClientSideValidations::Extender.extend 'ActiveModel', %w[Absence Acceptance Exclusion Format Inclusion Length Numericality Presence]

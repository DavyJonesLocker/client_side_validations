# frozen_string_literal: true

module ClientSideValidations
  module ActiveRecord
    module Uniqueness
      def client_side_hash(model, attribute, _force = nil)
        hash = {}
        hash[:message]        = model.errors.generate_message(attribute, message_type, options.except(:scope))
        hash[:case_sensitive] = options[:case_sensitive]
        hash[:id]             = model.id unless model.new_record?
        hash[:allow_blank]    = true if options[:allow_nil] || options[:allow_blank]

        apply_class_option! hash, model
        apply_scope_option! hash, model

        hash
      end

      private

      def apply_class_option!(hash, model)
        if options.key?(:client_validations) && options[:client_validations].key?(:class)
          hash[:class] = options[:client_validations][:class].underscore
        elsif model.class.name.demodulize != model.class.name
          hash[:class] = model.class.name.underscore
        end
      end

      def apply_scope_option!(hash, model)
        return unless options.key?(:scope) && options[:scope].present?

        hash[:scope] = Array.wrap(options[:scope]).inject({}) do |scope_hash, scope_item|
          scope_hash.merge!(scope_item => model.send(scope_item))
        end
      end

      def message_type
        :taken
      end
    end
  end
end

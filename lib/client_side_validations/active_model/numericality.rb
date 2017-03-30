# frozen_string_literal: true

module ClientSideValidations
  module ActiveModel
    module Numericality
      @@option_map = {}

      def self.included(base)
        @@option_map.merge!(base::CHECKS.keys.inject({}) { |acc, elem| acc.merge!(elem => elem) })
      end

      def client_side_hash(model, attribute, force = nil)
        options = self.options.dup
        hash    = options_hash(model, attribute, options)

        @@option_map.each do |option, message_type|
          count = options[option]
          next unless count

          if count.respond_to?(:call)
            next unless force
            count = count.call(model)
          end

          hash[:messages][option] = model.errors.generate_message(attribute, message_type, options.merge(count: count))
          hash[option] = count
        end

        copy_conditional_attributes(hash, options)

        hash
      end

      private

      def options_hash(model, attribute, options)
        hash = { messages: { numericality: model.errors.generate_message(attribute, :not_a_number, options) } }

        if options[:only_integer]
          hash[:messages][:only_integer] = model.errors.generate_message(attribute, :not_an_integer, options)
          hash[:only_integer] = true
        end

        hash[:allow_blank] = true if options[:allow_nil] || options[:allow_blank]

        hash
      end
    end
  end
end

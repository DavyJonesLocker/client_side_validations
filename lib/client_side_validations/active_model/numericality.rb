module ClientSideValidations
  module ActiveModel
    module Numericality
      @@option_map = {}

      def self.included(base)
        @@option_map.merge!(base::CHECKS.keys.inject({}) { |a, e| a.merge!(e => e) })
      end

      def client_side_hash(model, attribute, force = nil)
        options = self.options.dup
        hash    = { messages: { numericality: model.errors.generate_message(attribute, :not_a_number, options) } }

        if options[:only_integer]
          hash[:messages][:only_integer] = model.errors.generate_message(attribute, :not_an_integer, options)
          hash[:only_integer] = true
        end

        hash[:allow_blank] = true if options[:allow_nil] || options[:allow_blank]

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
    end
  end
end

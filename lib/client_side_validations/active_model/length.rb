# frozen_string_literal: true

module ClientSideValidations
  module ActiveModel
    module Length
      def client_side_hash(model, attribute, _force = nil)
        options = self.options.dup
        hash    = options_hash(options)

        self.class::MESSAGES.each do |option, message_type|
          count = options[option]
          next unless count

          options[:message] = options[message_type] if options[message_type].present?
          options.delete(:message) if options[:message].nil?
          hash[:messages][option] = model.errors.generate_message(attribute, message_type, options.merge(count: count))
          hash[option] = count
        end

        copy_conditional_attributes(hash, options)

        hash
      end

      private

      def options_hash(options)
        hash = { messages: {} }
        hash[:js_tokenizer] = options[:js_tokenizer] if options[:js_tokenizer]
        hash[:allow_blank]  = true if options[:allow_nil] || options[:allow_blank]
        hash
      end
    end
  end
end

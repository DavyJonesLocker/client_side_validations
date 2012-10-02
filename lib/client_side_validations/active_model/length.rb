module ClientSideValidations::ActiveModel
  module Length

    def client_side_hash(model, attribute, force = nil)
      options = self.options.dup
      hash    = { :messages => {} }
      hash[:js_tokenizer] = options[:js_tokenizer] if options[:js_tokenizer]
      hash[:allow_blank]  = true if options[:allow_blank]

      self.class::MESSAGES.each do |option, message_type|
        if count = options[option]
          options[:message] = options[message_type] if options[message_type].present?
          options.delete(:message) if options[:message].nil?
          hash[:messages][option] = model.errors.generate_message(attribute, message_type, options.merge(:count => count))
          hash[option] = count
        end
      end

      copy_conditional_attributes(hash, options)

      hash
    end

  end
end


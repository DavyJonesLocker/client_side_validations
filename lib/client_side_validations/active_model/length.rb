module ClientSideValidations::ActiveModel
  module Length

    def client_side_hash(model, attribute)
      options = self.options.dup
      hash    = { :messages => {} }
      hash[:js_tokenizer] = options[:js_tokenizer] if options[:js_tokenizer]
      hash[:allow_blank]  = true if options[:allow_blank]

      self.class::MESSAGES.each do |option, message_type|
        if count = options[option]
          options[:message] = options[message_type]
          options.delete(:message) if options[:message].nil?
          hash[:messages][option] = model.errors.generate_message(attribute, message_type, options.merge(:count => count))
          hash[option] = count
        end
      end

      hash
    end

  end
end


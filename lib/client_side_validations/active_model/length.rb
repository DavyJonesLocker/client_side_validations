module ClientSideValidations::ActiveModel
  module Length

    # This needs to handle the :tokenizer option. Currently the client side script will just assume
    # the default of value.split(//)
    def client_side_hash(model, attribute)
      extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS).except(:tokenizer, :too_long, :too_short, :wrong_length)

      errors_options = options.except(*self.class::RESERVED_OPTIONS)
      messages = extra_options.except(:js_tokenizer).keys.inject({}) do |hash, key|
        errors_options[:count] = extra_options[key]
        count = extra_options[key]
        default_message = options[self.class::MESSAGES[key]]
        errors_options[:message] ||= default_message if default_message

        hash.merge!(key => model.errors.generate_message(attribute, self.class::MESSAGES[key], errors_options))
      end

      { :messages => messages }.merge(extra_options)
    end

  end
end


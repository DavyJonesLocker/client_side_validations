module ClientSideValidations::ActiveModel
  module Length

    # This needs to handle the :tokenizer option. Currently the client side script will just assume
    # the default of value.split(//)
    def client_side_hash(model, attribute)
      extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS).except(:tokenizer)

      messages = extra_options.except(:js_tokenizer).keys.inject({}) do |hash, key|
        count = extra_options[key]
        hash.merge!(key => model.errors.generate_message(attribute, self.class::MESSAGES[key], :count => count))
      end

      { :messages => messages }.merge(extra_options)
    end

  end
end


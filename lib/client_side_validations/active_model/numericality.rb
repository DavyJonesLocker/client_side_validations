module ClientSideValidations::ActiveModel
  module Numericality

    OPTION_MAP = {}

    def self.included(base)
      OPTION_MAP.merge!(base::CHECKS.keys.inject({}) { |hash, key| hash.merge!(key => key) })
    end

    def client_side_hash(model, attribute)
      options = self.options.dup
      hash    = { :messages => { :numericality => model.errors.generate_message(attribute, :not_a_number, options) } }

      if options[:only_integer]
        hash[:messages][:only_integer] = model.errors.generate_message(attribute, :not_an_integer, options)
        hash[:only_integer] = true
      end

      OPTION_MAP.each do |option, message_type|
        if count = options[option]
          hash[:messages][option] = model.errors.generate_message(attribute, message_type, options.merge(:count => count))
          hash[option] = count
        end
      end

      copy_conditional_attributes(hash, options)

      hash
    end

  end
end


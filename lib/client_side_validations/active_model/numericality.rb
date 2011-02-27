module ClientSideValidations::ActiveModel
  module Numericality

    OPTION_MAP = {}

    def self.included(base)
      OPTION_MAP.merge!(base::CHECKS.keys.inject({}) { |hash, key| hash.merge!(key => key) })
      OPTION_MAP.merge!(:numericality => :not_a_number, :only_integer => :not_an_integer)
    end

    def client_side_hash(model, attribute)
      extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS).reject { |key, value| key == :only_integer && !value }
      keys = [:numericality] | extra_options.keys
      messages = keys.inject({}) do |hash, key|
        count = extra_options[key]
        hash.merge!(key => model.errors.generate_message(attribute, OPTION_MAP[key], :count => count))
      end

      { :messages => messages }.merge(extra_options)
    end

  end
end


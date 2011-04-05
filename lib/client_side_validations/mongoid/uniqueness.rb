module ClientSideValidations::Mongoid
  module Uniqueness
    def client_side_hash(model, attribute)
      extra_options = options.except(*::ActiveModel::Errors::CALLBACKS_OPTIONS - [:on, :allow_blank])
      hash = { :message => model.errors.generate_message(attribute, message_type, extra_options.except(:case_sensitive, :scope)) }
      hash = hash.merge(extra_options).merge(model.new_record? ? {} : { :id => model.id })

      if hash[:scope].present?
        hash[:scope] = Array.wrap(hash[:scope]).inject({}) do |scope_hash, scope_item|
          scope_hash.merge!(scope_item => model.send(scope_item))
        end
      else
        hash.delete(:scope)
      end

      hash
    end

    private

    def message_type
      :taken
    end
  end
end


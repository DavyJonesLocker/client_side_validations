module ClientSideValidations::ActiveRecord
  module Uniqueness
    def client_side_hash(model, attribute)
      super.merge(model.new_record? ? {} : { :id => model.id })
    end

    private

    def message_type
      :taken
    end
  end
end


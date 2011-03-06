module ClientSideValidations::ActiveRecord
  module Uniqueness
    def client_side_hash(model, attribute)
      super.merge(:id => model.id).delete_if { |key, value| value.nil? }
    end

    private

    def message_type
      :taken
    end
  end
end


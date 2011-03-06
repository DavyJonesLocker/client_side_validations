module ClientSideValidations::Mongoid
  module Uniqueness
    def client_side_hash(model, attribute)
      id_hash = model.new_record? ? {} : { :id => model.id }
      super.merge(id_hash)
    end

    private

    def message_type
      :taken
    end
  end
end


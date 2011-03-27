module ClientSideValidations::ActiveModel
  module Exclusion

    def client_side_hash(model, attribute)
      hash = super
      if hash[:in].is_a?(Range)
        hash[:range] = hash[:in]
        hash.delete(:in)
      end
      hash
    end

  end
end


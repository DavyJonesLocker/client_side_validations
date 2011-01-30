module ClientSideValidations::Mongoid
  module Uniqueness
    def message_types
      [:taken]
    end
  end
end


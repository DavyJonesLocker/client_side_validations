module ClientSideValidations::ActiveRecord
  module Uniqueness
    def message_types
      [:taken]
    end
  end
end


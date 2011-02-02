module ClientSideValidations::ActiveRecord
  module Uniqueness
    private

    def message_types
      [:taken]
    end
  end
end


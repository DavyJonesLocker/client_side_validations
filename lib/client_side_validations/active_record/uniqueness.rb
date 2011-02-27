module ClientSideValidations::ActiveRecord
  module Uniqueness
    private

    def message_type
      :taken
    end
  end
end


module ClientSideValidations::ActiveModel
  module Presence
    private

    def message_type
      :blank
    end
  end
end


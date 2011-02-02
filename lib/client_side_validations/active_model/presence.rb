module ClientSideValidations::ActiveModel
  module Presence
    private

    def message_types
      [:blank]
    end
  end
end


module ClientSideValidations::ActiveModel
  module Presence
    def message_types
      [:blank]
    end
  end
end

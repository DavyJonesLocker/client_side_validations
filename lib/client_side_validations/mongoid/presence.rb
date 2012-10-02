module ClientSideValidations::Mongoid
  module Presence
    private

    def message_type
      :blank
    end
  end
end


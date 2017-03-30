# frozen_string_literal: true

module ClientSideValidations
  module ActiveModel
    module Presence
      private

      def message_type
        :blank
      end
    end
  end
end

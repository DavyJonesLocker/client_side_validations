# frozen_string_literal: true

module ClientSideValidations
  module ActiveModel
    module Absence
      private

      def message_type
        :present
      end
    end
  end
end

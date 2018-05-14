# frozen_string_literal: true

module ClientSideValidations
  module Generators
    class RailsValidations
      def self.assets
        [{
          path: File.expand_path('../../../vendor/assets/javascripts', __dir__),
          file: 'rails.validations.js'
        }]
      end

      Generators.register_assets(self)
    end
  end
end

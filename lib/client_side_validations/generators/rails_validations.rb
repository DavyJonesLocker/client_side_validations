# frozen_string_literal: true

module ClientSideValidations
  module Generators
    class RailsValidations
      def self.assets
        [{
          path: File.expand_path('../../../dist', __dir__),
          file: 'client-side-validations.umd.js'
        }]
      end

      Generators.register_assets(self)
    end
  end
end

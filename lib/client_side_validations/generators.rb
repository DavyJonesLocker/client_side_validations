module ClientSideValidations
  module Generators
    ASSETS = []

    def self.register_assets(klass)
      ASSETS.push(*klass.assets)
    end
  end
end

require 'client_side_validations/generators/rails_validations'

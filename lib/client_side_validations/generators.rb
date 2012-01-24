module ClientSideValidations
  module Generators
    Assets = []

    def self.register_assets(klass)
      Assets.push(*klass.assets)
    end
  end
end

require 'client_side_validations/generators/rails_validations'


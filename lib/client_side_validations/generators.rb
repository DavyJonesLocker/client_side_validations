# frozen_string_literal: true

module ClientSideValidations
  module Generators
    @@assets = []

    def self.register_assets(klass)
      @@assets.concat(klass.assets)
    end

    def self.assets
      @@assets
    end
  end
end

require_relative 'generators/rails_validations'

module ClientSideValidations
  module Generators
    class CopyAssetGenerator < Rails::Generators::Base
      source_root File.expand_path('../../../../vendor/assets/javascripts', __FILE__)

      private

      def self.asset_pipeline_enabled?
        (Rails.configuration.assets || {})[:enabled]
      end

      def asset_pipeline_enabled?
        self.class.asset_pipeline_enabled?
      end

      public

      if asset_pipeline_enabled?
        desc 'Creates a ClientSideValidations initializer and copies rails.validations.js to app/assets/javascripts.'
      else
        desc 'Creates a ClientSideValidations initializer and copies rails.validations.js to public/javascripts.'
      end

      def copy_javascript_asset
        if asset_pipeline_enabled?
          destination = 'app/assets/javascripts'
        else
          destination = 'public/javascripts'
        end

        copy_file 'rails.validations.js', "#{destination}/rails.validations.js"
      end
    end
  end
end


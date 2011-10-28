module ClientSideValidations
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates/client_side_validations', __FILE__)

      private

      def self.asset_pipeline_enabled?
        (Rails.configuration.assets || {})[:enabled]
      end

      def asset_pipeline_enabled?
        self.class.asset_pipeline_enabled?
      end

      public

      if asset_pipeline_enabled?
        desc 'Creates a ClientSideValidations initializer.'
      else
        desc 'Creates a ClientSideValidations initializer and copies rails.validations.js to public/javascripts.'
      end

      def copy_initializer
        copy_file 'initializer.rb', 'config/initializers/client_side_validations.rb'
      end

      def copy_javascript_asset
        unless asset_pipeline_enabled?
          copy_file '../../../../vendor/assets/javascripts/rails.validations.js', 'public/javascripts/rails.validations.js'
        end
      end

      def show_readme
        if Rails.version >= '3.1'
          readme 'README.rails.3.1' if behavior == :invoke
        else
          readme 'README.rails.3.0' if behavior == :invoke
        end
      end

    end
  end
end


module ClientSideValidations
  module Generators
    class CopyAssetsGenerator < Rails::Generators::Base

      def copy_javascript_asset
        if self.class == CopyAssetsGenerator || !asset_pipeline_enabled?
          assets.each do |asset|
            source_paths << asset[:path]
            copy_file asset[:file], "#{asset_directory}/#{asset[:file]}"
          end
        end
      end

      private

      def self.asset_directory
        if asset_pipeline_enabled?
          "app#{Rails.configuration.assets.prefix}/javascripts"
        else
          'public/javascripts'
        end
      end

      def asset_directory
        CopyAssetsGenerator.asset_directory
      end

      def self.assets
        Assets
      end

      def assets
        CopyAssetsGenerator.assets
      end

      def self.asset_file_names
        assets.map { |asset| asset[:file] }.join(', ')
      end

      def self.asset_pipeline_enabled?
        # Rails 4.1 doesn't provide :enabled in asset configuration, so we look for Sprockets
        defined?(Sprockets).present?
      end

      def asset_pipeline_enabled?
        self.class.asset_pipeline_enabled?
      end

      def self.installation_message
        "Copies #{asset_file_names} to #{asset_directory}"
      end

      desc installation_message
    end
  end
end


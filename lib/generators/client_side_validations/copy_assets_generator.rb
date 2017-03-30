# frozen_string_literal: true

module ClientSideValidations
  module Generators
    class CopyAssetsGenerator < Rails::Generators::Base
      def copy_javascript_asset
        return unless self.class == CopyAssetsGenerator || !asset_pipeline_enabled?
        assets.each do |asset|
          source_paths << asset[:path]
          copy_file asset[:file], "#{asset_directory}/#{asset[:file]}"
        end
      end

      def self.asset_directory
        if asset_pipeline_enabled?
          "app#{Rails.configuration.assets.prefix}/javascripts"
        else
          'public/javascripts'
        end
      end

      def self.assets
        ClientSideValidations::Generators.assets
      end

      def self.asset_file_names
        assets.map { |asset| asset[:file] }.join(', ')
      end

      def self.asset_pipeline_enabled?
        # Rails 4.1 doesn't provide :enabled in asset configuration, so we look for Sprockets
        defined?(Sprockets).present?
      end

      def self.installation_message
        "Copies #{asset_file_names} to #{asset_directory}"
      end

      desc installation_message

      private

      def asset_directory
        CopyAssetsGenerator.asset_directory
      end

      def assets
        CopyAssetsGenerator.assets
      end

      def asset_pipeline_enabled?
        self.class.asset_pipeline_enabled?
      end
    end
  end
end

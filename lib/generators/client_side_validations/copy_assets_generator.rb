# frozen_string_literal: true

module ClientSideValidations
  module Generators
    class CopyAssetsGenerator < Rails::Generators::Base
      def copy_javascript_asset
        return unless instance_of?(CopyAssetsGenerator) || copy_assets?

        assets.each do |asset|
          source_paths << asset[:path]
          copy_file asset[:file], "#{asset_directory}/#{asset[:file]}"
        end
      end

      def self.asset_directory
        if sprockets?
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

      def self.copy_assets?
        !sprockets? && !webpacker?
      end

      def self.sprockets?
        defined?(Sprockets)
      end

      def self.webpacker?
        defined?(Webpacker)
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

      def copy_assets?
        self.class.copy_assets?
      end
    end
  end
end

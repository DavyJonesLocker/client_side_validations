module ClientSideValidations
  module Generators
    class CopyAssetGenerator < Rails::Generators::Base
      source_root File.expand_path('../../../../vendor/assets/javascripts', __FILE__)
      if Rails.version >= '3.1'
        desc 'Creates a ClientSideValidations initializer and copies rails.validations.js to app/assets/javascripts.'
      else
        desc 'Creates a ClientSideValidations initializer and copies rails.validations.js to public/javascripts.'
      end

      def copy_javascript_asset
        if Rails.version >= '3.1'
          destination = 'app/assets/javascripts'
        else
          destination = 'public/javascripts'
        end

        copy_file 'rails.validations.js', "#{destination}/rails.validations.js"
      end
    end
  end
end


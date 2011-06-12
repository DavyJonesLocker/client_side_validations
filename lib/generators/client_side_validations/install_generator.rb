module ClientSideValidations
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates/client_side_validations', __FILE__)

      if Rails.version >= '3.1'
        desc 'Creates a ClientSideValidations initializer.'
      else
        desc 'Creates a ClientSideValidations initializer and copies rails.validations.js to public/javascripts.'
      end

      def copy_initializer
        copy_file 'initializer.rb', 'config/initializers/client_side_validations.rb'
      end

      def copy_javascript_asset
        if Rails.version >= '3.0'
          if Rails.version < '3.1'
            copy_file '../../../../vendor/assets/javascripts/rails.validations.js', 'public/javascripts/rails.validations.js'
          end
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


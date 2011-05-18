module ClientSideValidations
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../../templates', __FILE__)

      desc 'Creates a ClientSideValidations initializer and copies client-side-validations.js to public/javascripts.'

      def copy_initializer
        copy_file 'client_side_validations.rb', 'config/initializers/client_side_validations.rb'
      end

      def copy_locale
        copy_file '../../../vendor/assets/javascripts/rails.validations.js', 'public/javascripts/rails.validations.js' if ::Rails.version < "3.1"
      end

      def show_readme
        readme 'README' if behavior == :invoke
      end
    end
  end
end


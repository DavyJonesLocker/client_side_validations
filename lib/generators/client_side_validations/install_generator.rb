# frozen_string_literal: true

module ClientSideValidations
  module Generators
    class InstallGenerator < Rails::Generators::Base
      TEMPLATE_ROOT = File.expand_path('../templates/client_side_validations', __dir__)

      source_paths << TEMPLATE_ROOT

      desc 'Copies the initializer and Stimulus controller into the application'

      def copy_initializer
        copy_file 'initializer.rb', 'config/initializers/client_side_validations.rb'
      end

      def copy_stimulus_controller
        copy_file 'client_side_validations_controller.js',
                  'app/javascript/controllers/client_side_validations_controller.js'
      end
    end
  end
end

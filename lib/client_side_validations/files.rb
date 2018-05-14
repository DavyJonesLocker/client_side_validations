# frozen_string_literal: true

# This is only used by dependant libraries that need to find the files

module ClientSideValidations
  module Files
    Initializer = File.expand_path(File.dirname(__FILE__) + '/../generators/templates/client_side_validations/initializer.rb')
    Javascript  = File.expand_path(File.dirname(__FILE__) + '/../../vendor/assets/javascripts/rails.validations.js')
  end
end

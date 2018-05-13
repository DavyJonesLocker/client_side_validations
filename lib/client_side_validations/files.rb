# frozen_string_literal: true

# This is only used by dependant libraries that need to find the files

module ClientSideValidations
  module Files
    Initializer = File.expand_path(File.dirname(__FILE__) + '/../generators/templates/client_side_validations/initializer.rb')
    Javascript  = File.expand_path(File.dirname(__FILE__) + '/../../dist/client-side-validations.umd.js')
  end
end

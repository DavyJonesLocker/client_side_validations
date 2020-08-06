# frozen_string_literal: true

# This is only used by dependant libraries that need to find the files

module ClientSideValidations
  module Files
    Initializer = File.expand_path('../generators/templates/client_side_validations/initializer.rb', __dir__)
    Javascript  = File.expand_path('../../vendor/assets/javascripts/rails.validations.js', __dir__)
  end
end

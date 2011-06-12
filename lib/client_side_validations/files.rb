# This is only used by dependant libraries that need to find the files

module ClientSideValidations
  module Files
    Javascript  = File.expand_path(File.dirname(__FILE__) + '/../../vendor/assets/javascripts/rails.validations.rb')
    Initializer = File.expand_path(File.dirname(__FILE__) + '/../generators/templates/client_side_validations/initializer.rb')
  end
end

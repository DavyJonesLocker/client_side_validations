# frozen_string_literal: true

require 'rails/generators/test_case'
require 'client_side_validations'
require 'generators/client_side_validations/install_generator'

class InstallGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::InstallGenerator
  destination File.expand_path('../tmp', __dir__)
  setup :prepare_destination

  test 'Installs the initializer' do
    run_generator

    assert_file 'config/initializers/client_side_validations.rb'
  end

  test 'Installs the Stimulus controller' do
    run_generator

    assert_file 'app/javascript/controllers/client_side_validations_controller.js' do |content|
      assert_match(/ClientSideValidationsController/, content)
      assert_match(%r{@client-side-validations/client-side-validations}, content)
    end
  end

  test 'Does not copy the legacy asset bundle' do
    run_generator

    assert_no_file 'public/javascripts/rails.validations.js'
    assert_no_file 'app/assets/javascripts/rails.validations.js'
  end
end

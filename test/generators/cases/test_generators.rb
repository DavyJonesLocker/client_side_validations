# frozen_string_literal: true

require 'rails/generators/test_case'
require 'client_side_validations'
require 'generators/client_side_validations/copy_assets_generator'
require 'generators/client_side_validations/install_generator'

class InstallGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::InstallGenerator
  destination File.expand_path('../tmp', __dir__)
  setup :prepare_destination

  test 'Assert all files are properly created without sprockets and webpacker' do
    stub_configuration
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
    assert_file 'public/javascripts/rails.validations.js'
  end

  test 'Assert all files are properly created with sprockets' do
    stub_configuration
    configuration = {}
    configuration.stubs(:prefix).returns('/assets')
    ClientSideValidations::Generators::CopyAssetsGenerator.stubs(:sprockets?).returns true
    Rails.configuration.stubs(:assets).returns(configuration)
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
    assert_no_file 'public/javascripts/rails.validations.js'
  end

  test 'Assert all files are properly created with webpacker' do
    stub_configuration
    configuration = {}
    configuration.stubs(:prefix).returns('/assets')
    ClientSideValidations::Generators::CopyAssetsGenerator.stubs(:webpacker?).returns true
    Rails.configuration.stubs(:assets).returns(configuration)
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
    assert_no_file 'public/javascripts/rails.validations.js'
  end

  private

  def stub_configuration
    Rails.stubs(:configuration).returns(mock('Configuration'))
  end
end

class CopyAssetsGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::CopyAssetsGenerator
  destination File.expand_path('../tmp', __dir__)
  setup :prepare_destination

  test 'Assert file is properly created without sprockets and webpacker' do
    stub_configuration
    run_generator
    assert_file 'public/javascripts/rails.validations.js'
  end

  test 'Assert file is properly created with sprockets' do
    stub_configuration
    configuration = {}
    configuration.stubs(:prefix).returns('/assets')
    ClientSideValidations::Generators::CopyAssetsGenerator.stubs(:sprockets?).returns true
    Rails.configuration.stubs(:assets).returns(configuration)
    run_generator
    assert_file 'app/assets/javascripts/rails.validations.js'
  end

  test 'Assert file is properly created with webpacker' do
    stub_configuration
    ClientSideValidations::Generators::CopyAssetsGenerator.stubs(:webpacker?).returns true
    run_generator
    assert_file 'public/javascripts/rails.validations.js'
  end

  private

  def stub_configuration
    Rails.stubs(:configuration).returns(mock('Configuration'))
  end
end

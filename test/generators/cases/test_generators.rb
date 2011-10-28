require 'rails/generators/test_case'
require 'generators/client_side_validations/install_generator'
require 'generators/client_side_validations/copy_asset_generator'

class InstallGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::InstallGenerator
  destination File.expand_path('../../tmp', __FILE__)
  setup :prepare_destination

  test 'Assert all files are properly created when no asset pipeline present' do
    asset_pipeline = Rails.configuration.assets
    Rails.configuration.assets = nil
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
    assert_file 'public/javascripts/rails.validations.js'
    Rails.configuration.assets = asset_pipeline
  end

  test 'Assert all files are properly created when asset pipeline present and disabled' do
    Rails.configuration.assets ||= {}
    Rails.configuration.assets[:enabled] = false
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
    assert_file 'public/javascripts/rails.validations.js'
  end

  test 'Assert all files are properly created when asset pipeline present and enabled' do
    Rails.configuration.assets ||= {}
    Rails.configuration.assets[:enabled] = true
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
  end
end

class CopyAssetGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::CopyAssetGenerator
  destination File.expand_path('../../tmp', __FILE__)
  setup :prepare_destination

  test 'Assert file is properly created when no asset pipeline present' do
    asset_pipeline = Rails.configuration.assets
    Rails.configuration.assets = nil
    run_generator
    assert_file 'public/javascripts/rails.validations.js'
    Rails.configuration.assets = asset_pipeline
  end

  test 'Assert file is properly created when asset pipeline present and disabled' do
    Rails.configuration.assets ||= {}
    Rails.configuration.assets[:enabled] = false
    run_generator
    assert_file 'public/javascripts/rails.validations.js'
  end

  test 'Assert file is properly created when asset pipeline present and enabled' do
    Rails.configuration.assets ||= {}
    Rails.configuration.assets[:enabled] = true
    run_generator
    assert_file 'app/assets/javascripts/rails.validations.js'
  end
end


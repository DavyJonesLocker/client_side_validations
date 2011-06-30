require 'rails/generators/test_case'
require 'generators/client_side_validations/install_generator'
require 'generators/client_side_validations/copy_asset_generator'

class InstallGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::InstallGenerator
  destination File.expand_path('../../tmp', __FILE__)
  setup :prepare_destination

  test 'Assert all files are properly created' do
    run_generator
    assert_file 'config/initializers/client_side_validations.rb'
    assert_file 'public/javascripts/rails.validations.js' if Rails.version > '3.0' && Rails.version < '3.1'
  end
end

class CopyAssetGeneratorTest < Rails::Generators::TestCase
  tests ClientSideValidations::Generators::CopyAssetGenerator
  destination File.expand_path('../../tmp', __FILE__)
  setup :prepare_destination

  test 'Assert file is properly created' do
    run_generator
    if Rails.version >= '3.1'
      assert_file 'app/assets/javascripts/rails.validations.js'
    else
      assert_file 'public/javascripts/rails.validations.js'
    end
  end
end


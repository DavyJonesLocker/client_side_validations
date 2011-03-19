require 'rails'

# Pulled from railties/test/abstract_unit in Rails 3.1
module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.logger = Logger.new(STDOUT)
  end
end

require 'active_record/models/user'
require 'client_side_validations/middleware'

TestApp::Application.initialize!

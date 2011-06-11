require 'base_helper'
require 'action_controller'
require 'action_controller/railtie'
require 'rails'

# Pulled from railties/test/abstract_unit in Rails 3.1
module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.logger = Logger.new(STDOUT)
  end
end

require 'client_side_validations/middleware'

TestApp::Application.initialize!

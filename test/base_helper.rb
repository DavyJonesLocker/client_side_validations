require 'rubygems'
require 'bundler'
Bundler.setup
require 'test/unit'
if RUBY_VERSION >= '1.9.3'
  require 'debugger'
end
require 'mocha'
require 'rails'

# Pulled from railties/test/abstract_unit in Rails 3.1
module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.logger = Logger.new(STDOUT)
  end
end


module ClientSideValidations; end

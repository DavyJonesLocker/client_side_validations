require 'rubygems'

require 'coveralls'
Coveralls.wear!

require 'bundler/setup'
require 'test/unit'

if RUBY_VERSION >= '1.9.3'
  require 'debugger'
end
require 'mocha'
require 'rails'
require 'client_side_validations/config'

module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.logger = Logger.new(STDOUT)
    if Rails.version.to_s >= '4.0.0'
      config.eager_load = false
      config.secret_key_base = "secretkey123"
    end
  end
end

module ClientSideValidations; end

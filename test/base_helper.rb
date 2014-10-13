# Configure Rails Environment
ENV['RAILS_ENV'] = 'test'

require 'rubygems'
require 'bundler/setup'
require 'minitest/autorun'
if RUBY_VERSION >= '2.0.0'
  require 'byebug'
else
  require 'debugger'
end
require 'mocha/setup'
require 'rails'
require 'client_side_validations/config'

module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.eager_load = false
    config.secret_key_base = '42'
    I18n.enforce_available_locales = true
  end
end

module ClientSideValidations; end

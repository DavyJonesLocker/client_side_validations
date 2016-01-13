# Configure Rails Environment
ENV['RAILS_ENV'] = 'test'

if ENV['CI']
  require 'coveralls'
  Coveralls.wear!
end

require 'simplecov'
SimpleCov.start 'rails' do
  add_filter %w(version.rb initializer.rb)
end

require 'rubygems'
require 'bundler/setup'
require 'minitest/autorun'
require 'byebug'
require 'mocha/setup'
require 'rails'
require 'client_side_validations/config'

module TestApp
  class Application < Rails::Application
    config.root = File.dirname(__FILE__)
    config.active_support.deprecation = :log
    config.active_support.test_order = :random
    config.eager_load = false
    config.secret_key_base = '42'
    I18n.enforce_available_locales = true
  end
end

module ClientSideValidations; end

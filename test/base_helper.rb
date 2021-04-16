# frozen_string_literal: true

# Configure Rails Environment
ENV['RAILS_ENV'] = 'test'

if ENV['CI']
  require 'coveralls'
  Coveralls.wear!
end

require 'simplecov'
SimpleCov.start 'rails' do
  add_filter %w[version.rb initializer.rb]
end

require 'rubygems'
require 'bundler/setup'
require 'minitest/autorun'
require 'byebug'
require 'mocha/minitest'

require 'rails'
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_view/railtie'
require 'rails/test_unit/railtie'

require 'client_side_validations/config'

ENV['DATABASE_URL'] = "#{defined?(JRUBY_VERSION) ? 'jdbcsqlite3' : 'sqlite3'}::memory:"

module TestApp
  class Application < Rails::Application
    config.try :load_defaults, "#{Rails::VERSION::MAJOR}.#{Rails::VERSION::MINOR}"

    config.root = __dir__
    config.active_support.deprecation = :log
    config.active_support.test_order = :random
    config.eager_load = false
    config.secret_key_base = '42'
    I18n.enforce_available_locales = true
  end
end

Rails.application.initialize!

module ClientSideValidations; end

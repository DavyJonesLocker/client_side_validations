# frozen_string_literal: true

lib = File.expand_path('lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'client_side_validations/version'

Gem::Specification.new do |spec|
  spec.name          = 'client_side_validations'
  spec.version       = ClientSideValidations::VERSION
  spec.authors       = ['Geremia Taglialatela', 'Brian Cardarella']
  spec.email         = ['tagliala.dev@gmail.com', 'bcardarella@gmail.com']

  spec.summary       = 'Client Side Validations'
  spec.description   = 'Client Side Validations made easy for your Rails 5 applications'
  spec.homepage      = 'https://github.com/DavyJonesLocker/client_side_validations'
  spec.license       = 'MIT'

  spec.platform      = Gem::Platform::RUBY

  spec.files         = `git ls-files -z -- {CHANGELOG.md,LICENSE.md,README.md,lib,vendor}`.split("\x0")
  spec.require_paths = ['lib']

  spec.add_dependency 'rails', '>= 5.0.0.1', '<= 6.0'

  spec.add_dependency 'jquery-rails', '~> 4.3'
  spec.add_dependency 'js_regex', '~> 3.1'

  spec.add_development_dependency 'appraisal', '~> 2.2'
  spec.add_development_dependency 'byebug', '~> 10.0'
  spec.add_development_dependency 'coveralls_reborn', '~> 0.12.0'
  spec.add_development_dependency 'm', '~> 1.5'
  spec.add_development_dependency 'minitest', '~> 5.11'
  spec.add_development_dependency 'mocha', '~> 1.7'
  spec.add_development_dependency 'rake', '~> 12.3'
  spec.add_development_dependency 'rubocop', '~> 0.59.2'
  spec.add_development_dependency 'simplecov', '~> 0.16.1'
  spec.add_development_dependency 'sqlite3', '~> 1.3'

  # For QUnit testing
  spec.add_development_dependency 'coffee-script', '~> 2.4'
  spec.add_development_dependency 'shotgun', '~> 0.9.2'
  spec.add_development_dependency 'sinatra', '~> 2.0'
  spec.add_development_dependency 'thin', '~> 1.7'
end

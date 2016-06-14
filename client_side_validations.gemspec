# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'client_side_validations/version'

Gem::Specification.new do |spec|
  spec.name          = 'client_side_validations'
  spec.version       = ClientSideValidations::VERSION
  spec.authors       = ['Geremia Taglialatela', 'Brian Cardarella']
  spec.email         = ['tagliala.dev@gmail.com', 'bcardarella@gmail.com']

  spec.summary       = 'Client Side Validations'
  spec.description   = 'Client Side Validations made easy for your Rails 4 applications'
  spec.homepage      = 'https://github.com/DavyJonesLocker/client_side_validations'
  spec.license       = 'MIT'

  spec.platform      = Gem::Platform::RUBY

  spec.files         = `git ls-files -z -- {HISTORY.md,README.md,lib,vendor}`.split("\x0")
  spec.require_paths = ['lib']

  spec.add_dependency 'rails', '>= 4.0.0', '< 4.3.0'
  spec.add_dependency 'jquery-rails', '>= 3.1.2', '< 5.0.0'
  spec.add_dependency 'js_regex', '~> 1.0', '>= 1.0.9'

  spec.add_development_dependency 'appraisal', '~> 2.1'
  spec.add_development_dependency 'coveralls', '~> 0.8.13'
  spec.add_development_dependency 'm', '~> 1.5'
  spec.add_development_dependency 'minitest', '>= 4.7.5', '< 6.0.0'
  spec.add_development_dependency 'mocha', '~> 1.1'
  spec.add_development_dependency 'rake', '~> 11.2'
  spec.add_development_dependency 'rubocop', '~> 0.40.0'
  spec.add_development_dependency 'simplecov', '~> 0.11.2'
  spec.add_development_dependency 'sqlite3', '~> 1.3'

  spec.add_development_dependency 'byebug', '~> 9.0'

  # For QUnit testing
  spec.add_development_dependency 'sinatra', '~> 1.4'
  spec.add_development_dependency 'shotgun', '~> 0.9.1'
  spec.add_development_dependency 'thin', '~> 1.7'
  spec.add_development_dependency 'json', '~> 1.8'
  spec.add_development_dependency 'coffee-script', '~> 2.4'
end

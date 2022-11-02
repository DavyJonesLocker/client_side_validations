# frozen_string_literal: true

lib = File.expand_path('lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'client_side_validations/version'

Gem::Specification.new do |spec|
  spec.name        = 'client_side_validations'
  spec.version     = ClientSideValidations::VERSION
  spec.authors     = ['Geremia Taglialatela', 'Brian Cardarella']
  spec.email       = ['tagliala.dev@gmail.com', 'bcardarella@gmail.com']

  spec.summary     = 'Client Side Validations'
  spec.description = 'Client Side Validations made easy for your Rails 5 applications'
  spec.homepage    = 'https://github.com/DavyJonesLocker/client_side_validations'
  spec.license     = 'MIT'

  spec.metadata['rubygems_mfa_required'] = 'true'

  spec.metadata['bug_tracker_uri'] = 'https://github.com/DavyJonesLocker/client_side_validations/issues'
  spec.metadata['changelog_uri']   = 'https://github.com/DavyJonesLocker/client_side_validations/blob/main/CHANGELOG.md'
  spec.metadata['source_code_uri'] = 'https://github.com/DavyJonesLocker/client_side_validations'

  spec.files         = `git ls-files -z -- {CHANGELOG.md,LICENSE.md,README.md,lib,vendor}`.split("\x0")
  spec.require_paths = ['lib']

  spec.platform              = Gem::Platform::RUBY
  spec.required_ruby_version = '>= 2.6'

  spec.add_dependency 'rails', '>= 5.2', '< 7.1'

  spec.add_dependency 'js_regex', '~> 3.7'

  spec.add_development_dependency 'appraisal', '~> 2.4'
  spec.add_development_dependency 'byebug', '~> 11.1'
  spec.add_development_dependency 'm', '~> 1.6'
  spec.add_development_dependency 'minitest', '~> 5.16'
  spec.add_development_dependency 'mocha', '~> 2.0'
  spec.add_development_dependency 'rake', '~> 13.0'
  spec.add_development_dependency 'simplecov', '~> 0.21.2'
  spec.add_development_dependency 'simplecov-lcov', '~> 0.8.0'
  spec.add_development_dependency 'sqlite3', '~> 1.5'

  # For QUnit testing
  spec.add_development_dependency 'shotgun', '~> 0.9.2'
  spec.add_development_dependency 'sinatra', '~> 3.0'
  spec.add_development_dependency 'webrick', '~> 1.7'
end

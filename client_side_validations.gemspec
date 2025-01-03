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
  spec.description = 'Client Side Validations made easy for your Rails 6.1, 7.x, and 8.0 applications'
  spec.homepage    = 'https://github.com/DavyJonesLocker/client_side_validations'
  spec.license     = 'MIT'

  spec.metadata['rubygems_mfa_required'] = 'true'

  spec.metadata['bug_tracker_uri'] = 'https://github.com/DavyJonesLocker/client_side_validations/issues'
  spec.metadata['changelog_uri']   = 'https://github.com/DavyJonesLocker/client_side_validations/blob/main/CHANGELOG.md'
  spec.metadata['source_code_uri'] = 'https://github.com/DavyJonesLocker/client_side_validations'

  spec.files         = Dir.glob('{CHANGELOG.md,LICENSE.md,README.md,lib/**/*.rb,vendor/**/*.js}', File::FNM_DOTMATCH)
  spec.require_paths = ['lib']

  spec.platform              = Gem::Platform::RUBY
  spec.required_ruby_version = '>= 3.1'

  spec.add_dependency 'js_regex', '~> 3.7'
  spec.add_dependency 'rails', '>= 6.1'
end

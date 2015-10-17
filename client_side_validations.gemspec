# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "client_side_validations/version"

Gem::Specification.new do |s|
  s.name        = "client_side_validations"
  s.version     = ClientSideValidations::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Brian Cardarella"]
  s.email       = ["bcardarella@gmail.com"]
  s.homepage    = "https://github.com/DavyJonesLocker/client_side_validations"
  s.summary     = %q{Client Side Validations}
  s.description = %q{Client Side Validations made easy for your Rails 4 applications}
  s.license     = 'MIT'

  s.files         = `git ls-files -- {lib/*,vendor/*,*.gemspec}`.split("\n")
  s.require_paths = ["lib"]

  s.add_dependency 'rails', '>= 4.0.0', '< 4.3.0'
  s.add_dependency 'jquery-rails', '>= 3.1.2', '< 5.0.0'
  s.add_dependency 'js_regex', '~> 1.0'

  s.add_development_dependency 'appraisal', '~> 2.0'
  s.add_development_dependency 'coveralls', '~> 0.8.1'
  s.add_development_dependency 'm', '~> 1.3'
  s.add_development_dependency 'minitest', '>= 4.7.5', '< 6.0.0'
  s.add_development_dependency 'mocha', '~> 1.1'
  s.add_development_dependency 'simplecov', '~> 0.10.0'
  s.add_development_dependency 'sqlite3', '~> 1.3'

  if Gem::Version.new(RUBY_VERSION.dup) >= Gem::Version.new('2.0')
    s.add_development_dependency 'byebug', '~> 5.0'
  else
    s.add_development_dependency 'debugger', '~> 1.6'
  end

  # For QUnit testing
  s.add_development_dependency 'sinatra', '~> 1.4'
  s.add_development_dependency 'shotgun', '~> 0.9'
  s.add_development_dependency 'thin', '~> 1.6'
  s.add_development_dependency 'json', '~> 1.8'
  s.add_development_dependency 'coffee-script', '~> 2.4'
end

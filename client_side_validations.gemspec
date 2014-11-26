# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "client_side_validations/version"

Gem::Specification.new do |s|
  s.name        = "client_side_validations"
  s.version     = ClientSideValidations::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Brian Cardarella"]
  s.email       = ["bcardarella@gmail.com"]
  s.homepage    = "https://github.com/bcardarella/client_side_validations"
  s.summary     = %q{Client Side Validations}
  s.description = %q{Client Side Validations}

  s.files         = `git ls-files -- {lib/*,vendor/*,*.gemspec}`.split("\n")
  s.require_paths = ["lib"]

  s.add_development_dependency 'rails', '>= 4.0.0', '<= 4.2.0.beta4'
  s.add_development_dependency 'sqlite3', '~> 1.3.10'
  s.add_development_dependency 'mocha', '~> 1.1.0'
  s.add_development_dependency 'm', '~> 1.3.2'
  s.add_development_dependency 'minitest', '>= 4.7.5', '< 5.5.0'
  s.add_development_dependency 'simplecov', '~> 0.9.1'
  s.add_development_dependency 'coveralls', '~> 0.7.1'
  s.add_development_dependency 'appraisal', '~> 1.0.2'

  # For QUnit testing
  s.add_development_dependency 'sinatra', '~> 1.4.5'
  s.add_development_dependency 'shotgun', '~> 0.9'
  s.add_development_dependency 'thin', '~> 1.6.3'
  s.add_development_dependency 'json', '~> 1.8.1'
  s.add_development_dependency 'coffee-script', '~> 2.3.0'
  s.add_development_dependency 'jquery-rails', '~> 4.0.0'
end

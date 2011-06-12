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
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_dependency 'activesupport', '3.1.0.rc4'

  s.add_development_dependency 'rails', '3.1.0.rc4'
  s.add_development_dependency 'sqlite3'
  s.add_development_dependency 'bson_ext'
  s.add_development_dependency 'mongoid', '~> 2.0.0'
  s.add_development_dependency 'mongo_mapper','~>0.9.0'
  s.add_development_dependency 'mocha'
  s.add_development_dependency 'simple_form'
  s.add_development_dependency 'formtastic'

  # For QUnit testing
  s.add_development_dependency 'sinatra', '~> 1.0'
  s.add_development_dependency 'shotgun'
  s.add_development_dependency 'thin'
  s.add_development_dependency 'json'

  ruby_minor_version = RUBY_VERSION.split('.')[1].to_i
  if ruby_minor_version == 8
    s.add_development_dependency 'minitest'
    s.add_development_dependency 'ruby-debug'
  elsif ruby_minor_version == 9
    s.add_development_dependency 'ruby-debug19'
  end
end

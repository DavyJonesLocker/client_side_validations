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

  s.rubyforge_project = "client_side_validations"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_development_dependency 'activemodel', '~> 3.0.3'
  s.add_development_dependency 'activerecord', '~> 3.0.3'
  s.add_development_dependency 'bson_ext'
  s.add_development_dependency 'mongoid', '~> 2.0.0.rc.6'

  ruby_minor_version = RUBY_VERSION.split('.')[1].to_i
  if ruby_minor_version == 8
    s.add_development_dependency 'ruby-debug'
  elsif ruby_minor_version == 9
    s.add_development_dependency 'ruby-debug19'
  end
end

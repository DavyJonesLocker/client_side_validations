require 'rubygems'
require 'ruby-debug'

ruby_minor_version = RUBY_VERSION.split('.')[1].to_i
if ruby_minor_version == 8
  require 'test/unit'
  require 'mocha'
elsif ruby_minor_version == 9
  require 'minitest/autorun'
end

module ClientSideValidations; end

require 'base_helper'
require 'active_record'
require 'client_side_validations/active_record'

ActiveRecord::Base.establish_connection(
  :adapter => defined?(JRUBY_VERSION) ? 'jdbcsqlite3' : 'sqlite3',
  :database => ':memory:'
)



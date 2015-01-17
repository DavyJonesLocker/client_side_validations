require 'base_helper'
require 'active_record'
require 'client_side_validations/active_record'

# Connection must be establised before anything else
ActiveRecord::Base.establish_connection(
  adapter: defined?(JRUBY_VERSION) ? 'jdbcsqlite3' : 'sqlite3',
  database: ':memory:'
)

require 'active_record/models/user'
require 'active_record/models/guid'
require 'active_record/models/thing'

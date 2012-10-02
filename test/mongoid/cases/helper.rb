require 'base_helper'
require 'mongoid'
require 'client_side_validations/mongoid'

Mongoid.configure do |config|
  name = 'client_side_validations_development'
  host = 'localhost'
  config.master = Mongo::Connection.new.db(name)
end

require 'mongoid/models/book'


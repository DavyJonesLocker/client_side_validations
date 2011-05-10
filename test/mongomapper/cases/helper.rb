require 'base_helper'
require 'mongo_mapper'
require 'client_side_validations/mongomapper'

MongoMapper.database = "client_side_validations_development"
MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)

require 'mongomapper/models/book'


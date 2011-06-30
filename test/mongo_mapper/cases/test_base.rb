require 'mongo_mapper/cases/helper'

class ClientSideValidations::MongoMapperTestBase < Test::Unit::TestCase
  include MongoMapper::Plugins::Validations

  def setup
    @magazine = Magazine.new
  end

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "has already been taken", :case_sensitive => true}
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@magazine, :age)
  end
end


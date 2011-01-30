require 'mongoid/cases/helper'

class ClientSideValidations::MongoidTest < Test::Unit::TestCase
  include Mongoid::Validations

  def test_uniqueness_message_types
    assert_equal [:taken],
      UniquenessValidator.new(:attributes => [:name]).message_types
  end
end


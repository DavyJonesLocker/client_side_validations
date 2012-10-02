require 'mongoid/cases/test_base'

class Mongoid::UniqunessValidatorTest < ClientSideValidations::MongoidTestBase

  def test_presence_client_side_hash
    expected_hash = { :message => "can't be blank" }
    assert_equal expected_hash, PresenceValidator.new(:attributes => [:name]).client_side_hash(@book, :age)
  end

  def test_presence_client_side_hash_with_custom_message
    expected_hash = { :message => "is required" }
    assert_equal expected_hash, PresenceValidator.new(:attributes => [:name], :message => "is required").client_side_hash(@book, :age)
  end

end


require 'mongoid/cases/test_base'

class Mongoid::UniqunessValidatorTest < ClientSideValidations::MongoidTestBase

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "is already taken" }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@book, :age)
  end

end


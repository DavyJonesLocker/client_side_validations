require 'active_model/cases/test_base'

class ActiveModel::InclusionValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_presence_client_side_hash
    expected_hash = { :message => "can't be blank" }
    assert_equal expected_hash, PresenceValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

end


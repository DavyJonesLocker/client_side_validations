require 'active_model/cases/test_base'

class ActiveModel::AcceptanceValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_acceptance_client_side_hash
    expected_hash = { :message => "must be accepted", :accept => "1" }
    assert_equal expected_hash, AcceptanceValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

end


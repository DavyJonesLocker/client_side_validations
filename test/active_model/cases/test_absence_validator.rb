require 'active_model/cases/test_base'

class ActiveModel::AbsenceValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_absence_client_side_hash
    expected_hash = { :message => "must be blank" }
    assert_equal expected_hash, AbsenceValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

  def test_absence_client_side_hash_with_custom_message
    expected_hash = { :message => "is required to be blank" }
    assert_equal expected_hash, AbsenceValidator.new(:attributes => [:name], :message => "is required to be blank").client_side_hash(@person, :age)
  end

end


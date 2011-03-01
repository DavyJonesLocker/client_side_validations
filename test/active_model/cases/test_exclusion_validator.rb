require 'active_model/cases/test_base'

class ActiveModel::ExclusionValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_exclusion_client_side_hash
    expected_hash = { :message => "is reserved", :in => 1..2 }
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => 1..2).client_side_hash(@person, :age)
  end

end


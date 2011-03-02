require 'active_model/cases/test_base'

class ActiveModel::InclusionValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_inclusion_client_side_hash
    expected_hash = { :message => "is not included in the list", :in => 1..2 }
    assert_equal expected_hash, InclusionValidator.new(:attributes => [:name], :in => 1..2).client_side_hash(@person, :age)
  end

  def test_inclusion_client_side_hash_with_custom_message
    expected_hash = { :message => "is not a choice", :in => 1..2 }
    assert_equal expected_hash, InclusionValidator.new(:attributes => [:name], :in => 1..2, :message => "is not a choice").client_side_hash(@person, :age)
  end

end


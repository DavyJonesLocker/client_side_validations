require 'active_model/cases/test_base'

class ActiveModel::ExclusionValidatorTest < ClientSideValidations::ActiveModelTestBase

  def test_exclusion_client_side_hash
    expected_hash = { :message => "is reserved", :in => [1, 2] }
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => [1, 2]).client_side_hash(@person, :age)
  end

  def test_exclusion_client_side_hash_with_custom_message
    expected_hash = { :message => "is exclusive", :in => [1, 2] }
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => [1, 2], :message => "is exclusive").client_side_hash(@person, :age)
  end

  def test_exclusion_client_side_hash_with_ranges
    expected_hash = { :message => "is reserved", :range => 1..2 }
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => 1..2).client_side_hash(@person, :age)
  end

  def test_exclusion_client_side_hash_ignore_proc
    @person.stubs(:range).returns([1,2])
    expected_hash = nil
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => Proc.new { |o| o.range }).client_side_hash(@person, :age)
  end

  def test_exclusion_client_side_hash_observe_proc
    @person.stubs(:range).returns([1,2])
    expected_hash = { :message => "is reserved", :in => [1, 2] }
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => Proc.new { |o| o.range }).client_side_hash(@person, :age, true)
  end

end

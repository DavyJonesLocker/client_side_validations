require 'active_record/cases/helper'
require 'active_record/models/user'

class ClientSideValidations::ActiveRecordTest < ActiveRecord::TestCase
  include ActiveRecord::Validations

  def setup
    @user = User.new
  end

  def test_uniqueness_client_side_hash
    expected_hash = { :message => "has already been taken", :case_sensitive => true }
    assert_equal expected_hash, UniquenessValidator.new(:attributes => [:name]).client_side_hash(@user, :age)
  end
end


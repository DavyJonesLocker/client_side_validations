require 'active_record/cases/helper'

class ClientSideValidations::ActiveRecordTest < ActiveRecord::TestCase
  include ActiveRecord::Validations

  def test_uniqueness_message_types
    assert_equal [:taken],
      UniquenessValidator.new(:attributes => [:name]).message_types
  end
end


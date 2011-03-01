require 'active_record/cases/helper'

class ClientSideValidations::ActiveRecordTestBase < ActiveRecord::TestCase
  include ActiveRecord::Validations

  def setup
    @user = User.new
  end

end


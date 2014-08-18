require 'active_record/cases/helper'

class ClientSideValidations::ActiveRecordTestBase < ActiveSupport::TestCase
  include ActiveRecord::Validations

  def setup
    @user = User.new
  end

end


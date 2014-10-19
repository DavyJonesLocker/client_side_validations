require 'active_model/cases/helper'

class ClientSideValidations::ActiveModelTestBase < ActiveModel::TestCase
  include ActiveModel::Validations

  def setup
    @person = Person.new
  end

end

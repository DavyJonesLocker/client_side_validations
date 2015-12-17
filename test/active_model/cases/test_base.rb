require 'active_model/cases/helper'

module ClientSideValidations
  class ActiveModelTestBase < ::ActiveModel::TestCase
    include ::ActiveModel::Validations

    def setup
      @person = Person.new
    end
  end
end

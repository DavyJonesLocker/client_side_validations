require 'active_model/cases/helper'

module ClientSideValidations
  class ActiveModelTestBase < ::ActiveSupport::TestCase
    include ::ActiveModel::Validations

    def setup
      @person = Person.new
    end
  end
end

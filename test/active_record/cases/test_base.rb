# frozen_string_literal: true

require 'active_record/cases/helper'

module ClientSideValidations
  class ActiveRecordTestBase < ::ActiveSupport::TestCase
    include ::ActiveRecord::Validations

    def setup
      @user = User.new
    end
  end
end

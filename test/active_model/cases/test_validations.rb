require 'active_model/cases/test_base'

class ActiveModel::ValidationsTest < ClientSideValidations::ActiveModelTestBase

  def test_validations_to_client_side_hash
    person = Person.new
    expected_hash = {
      :first_name => {
        :presence => {
          :message => "can't be blank"
        }
      },
      :email => {
        :format => {
          :message => "is invalid",
          :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
        }
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

end


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

  def test_validations_to_client_side_hash_with_validations_on_create
    person_class = Person.dup
    person_class.class_eval do
      validates_presence_of :last_name, :on => :create
      validates_presence_of :age, :on => :update

      def validation_context
        :create
      end
    end
    person = person_class.new
    expected_hash = {
      :first_name => {
        :presence => {
          :message => "can't be blank"
        }
      },
      :last_name => {
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

  def test_validations_to_client_side_hash_with_validations_on_update
    person_class = Person.dup
    person_class.class_eval do
      validates_presence_of :last_name, :on => :create
      validates_presence_of :age, :on => :update

      def validation_context
        :update
      end
    end
    person = person_class.new
    expected_hash = {
      :first_name => {
        :presence => {
          :message => "can't be blank"
        }
      },
      :age => {
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


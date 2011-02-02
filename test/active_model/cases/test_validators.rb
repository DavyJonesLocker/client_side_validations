require 'active_model/cases/helper'
require 'active_model/models/person'

class ClientSideValidations::ActiveModelTest < ActiveModel::TestCase
  include ActiveModel::Validations

  def setup
    @person = Person.new
  end

  def test_acceptance_client_side_hash
    expected_hash = { :message => "must be accepted", :accept => "1" }
    assert_equal expected_hash, AcceptanceValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

  def test_confirmation_client_side_hash
    expected_hash = { :message => "doesn't match confirmation" }
    assert_equal expected_hash, ConfirmationValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

  def test_exclusion_client_side_hash
    expected_hash = { :message => "is reserved", :in => 1..2 }
    assert_equal expected_hash, ExclusionValidator.new(:attributes => [:name], :in => 1..2).client_side_hash(@person, :age)
  end

  def test_format_client_side_hash
    expected_hash = { :message => "is invalid", :with => /.+/ }
    assert_equal expected_hash, FormatValidator.new(:attributes => [:name], :with => /.+/).client_side_hash(@person, :age)
  end

  def test_inclusion_client_side_hash
    expected_hash = { :message => "is not included in the list", :in => 1..2 }
    assert_equal expected_hash, InclusionValidator.new(:attributes => [:name], :in => 1..2).client_side_hash(@person, :age)
  end

  def test_presence_client_side_hash
    expected_hash = { :message => "can't be blank" }
    assert_equal expected_hash, PresenceValidator.new(:attributes => [:name]).client_side_hash(@person, :age)
  end

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


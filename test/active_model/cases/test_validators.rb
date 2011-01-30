# $LOAD_PATH.unshift File.dirname(__FILE__)
require 'active_model/cases/helper'

class ClientSideValidations::ActiveModelTest < ActiveModel::TestCase
  include ActiveModel::Validations

  def test_acceptance_message_types
    assert_equal [:acceptance],
      AcceptanceValidator.new(:attributes => [:name]).message_types
  end

  def test_confirmation_message_types
    assert_equal [:confirmation],
      ConfirmationValidator.new(:attributes => [:name]).message_types
  end

  def test_exclusion_message_types
    assert_equal [:exclusion],
      ExclusionValidator.new(:attributes => [:name], :in => 1..2).message_types
  end

  def test_format_message_types
    assert_equal [:invalid],
      FormatValidator.new(:attributes => [:name], :with => /.+/).message_types
  end

  def test_inclusion_message_types
    assert_equal [:inclusion],
      InclusionValidator.new(:attributes => [:name], :in => 1..2).message_types
  end

  def test_presence_message_types
    assert_equal [:blank],
      PresenceValidator.new(:attributes => [:name]).message_types
  end
end

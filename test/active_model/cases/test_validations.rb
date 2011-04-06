require 'active_model/cases/test_base'

class ActiveModel::ValidationsTest < ClientSideValidations::ActiveModelTestBase

  class Person
    include ::ActiveModel::Validations
    attr_accessor :first_name, :last_name, :age, :weight

    def self.name
      "Person"
    end

    def new_record?
      true
    end
  end

  def new_person
    person = Class.new(Person)
    yield(person)
    person.new
  end

  def test_validations_to_client_side_hash
    person = new_person do |p|
      p.validates_presence_of :first_name
    end
    expected_hash = {
      :first_name => {
        :presence => {
          :message => "can't be blank"
        }
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_validations_to_client_side_hash_with_validations_allow_blank
    person = new_person do |p|
      p.validates_length_of :first_name, :is => 10, :allow_blank => true
      p.validates_format_of :first_name, :with => //, :allow_blank => true
    end
    expected_hash = {
      :first_name => {
        :length => {
          :messages => { :is => 'is the wrong length (should be 10 characters)'},
          :is => 10,
          :allow_blank => true
        },
        :format => {
          :message => 'is invalid',
          :with => //,
          :allow_blank => true
        }
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_validations_to_client_side_hash_with_validations_on_create
    person = new_person do |p|
      p.validates_length_of :first_name, :is => 10, :on => :create
      p.validates_length_of :last_name, :is => 10, :on => :update
      p.validates_format_of :first_name, :with => //, :on => :update
      p.validates_format_of :last_name, :with => //, :on => :create
      p.validates_numericality_of :age, :on => :create
      p.validates_numericality_of :weight, :on => :update
      p.class_eval do
        def new_record?
          true
        end
      end
    end
    expected_hash = {
      :first_name => {
        :length => {
          :messages => { :is => 'is the wrong length (should be 10 characters)'},
          :is => 10,
        },
      },
      :last_name => {
        :format => {
          :message => 'is invalid',
          :with => //,
        }
      },
      :age => {
        :numericality => {
          :messages => { :numericality => 'is not a number' },
        }
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_validations_to_client_side_hash_with_validations_on_update
    person = new_person do |p|
      p.validates_length_of :first_name, :is => 10, :on => :update
      p.validates_length_of :last_name, :is => 10, :on => :create
      p.validates_format_of :first_name, :with => //, :on => :create
      p.validates_format_of :last_name, :with => //, :on => :update
      p.validates_numericality_of :age, :on => :update
      p.validates_numericality_of :weight, :on => :create
      p.class_eval do
        def new_record?
          false
        end
      end
    end
    expected_hash = {
      :first_name => {
        :length => {
          :messages => { :is => 'is the wrong length (should be 10 characters)'},
          :is => 10,
        },
      },
      :last_name => {
        :format => {
          :message => 'is invalid',
          :with => //,
        }
      },
      :age => {
        :numericality => {
          :messages => { :numericality => 'is not a number' },
        }
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_validates_with_should_be_ignored
    person = new_person do |p|
      p.validates_with PersonValidator
    end

    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_validators_with_if_or_unless_are_ignored
    person = new_person do |p|
      p.validates_presence_of :first_name, :if     => Proc.new { |p| true }
      p.validates_presence_of :last_name,  :unless => Proc.new { |p| true }
    end

    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_generic_block_validators_should_be_ignored
    person = new_person do |p|
      p.validates_each(:first_name) do |record, attr, value|
        record.errors.add(:first_name, "failed")
      end
    end

    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end
end


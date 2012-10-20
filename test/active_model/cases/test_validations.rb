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
        :presence => [{
          :message => "can't be blank"
        }]
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
        :length => [{
          :messages => { :is => 'is the wrong length (should be 10 characters)'},
          :is => 10,
          :allow_blank => true
        }],
        :format => [{
          :message => 'is invalid',
          :with => //,
          :allow_blank => true
        }]
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
      p.validates_numericality_of :age, :on => :create, :allow_blank => true
      p.validates_numericality_of :weight, :on => :update
      p.class_eval do
        def new_record?
          true
        end
      end
    end
    expected_hash = {
      :first_name => {
        :length => [{
          :messages => { :is => 'is the wrong length (should be 10 characters)'},
          :is => 10,
        }],
      },
      :last_name => {
        :format => [{
          :message => 'is invalid',
          :with => //,
        }]
      },
      :age => {
        :numericality => [{
          :messages => { :numericality => 'is not a number' },
          :allow_blank => true
        }]
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
        :length => [{
          :messages => { :is => 'is the wrong length (should be 10 characters)'},
          :is => 10,
        }],
      },
      :last_name => {
        :format => [{
          :message => 'is invalid',
          :with => //,
        }]
      },
      :age => {
        :numericality => [{
          :messages => { :numericality => 'is not a number' },
        }]
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

  def test_generic_block_validators_should_be_ignored
    person = new_person do |p|
      p.validates_each(:first_name) do |record, attr, value|
        record.errors.add(:first_name, "failed")
      end
    end

    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_conditionals_when_not_forced
    person = new_person do |p|
      p.validates :first_name, :presence => { :if => :can_validate? }
      p.validates :last_name,  :presence => { :unless => :cannot_validate? }

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          false
        end
      end
    end

    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_conditionals_when_all_forced_on
    person = new_person do |p|
      p.validates :first_name, :presence => { :if => :can_validate? }
      p.validates :last_name,  :presence => { :unless => :cannot_validate? }

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          false
        end
      end
    end

    expected_hash = {
      :first_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      },
      :last_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash(true)
  end

  def test_conditionals_forcing_individual_attributes_on
    person = new_person do |p|
      p.validates :first_name, :presence => { :if => :can_validate? }, :length => { :is => 5, :if => :can_validate? }
      p.validates :last_name, :presence => { :unless => :cannot_validate? }, :length => { :is => 10, :unless => :cannot_validate? }

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          true
        end
      end
    end

    expected_hash = {
      :first_name => {
        :presence => [{
          :message => "can't be blank"
        }],
        :length => [{
          :messages => { :is => 'is the wrong length (should be 5 characters)' },
          :is => 5
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash(:first_name => true)
  end

  def test_conditionals_forcing_individual_validators_on
    person = new_person do |p|
      p.validates :first_name, :presence => { :if => :can_validate? }, :length => { :is => 5, :if => :can_validate? }
      p.validates :last_name, :presence => { :unless => :cannot_validate? }, :length => { :is => 10, :unless => :cannot_validate? }

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          true
        end
      end
    end

    expected_hash = {
      :first_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash(:first_name => { :presence => true }, :last_name => { :presence => true })
  end

  def test_forcing_all_validators_off
    person = new_person do |p|
      p.validates :first_name, :presence => true
      p.validates :last_name, :presence => true

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          true
        end
      end
    end

    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash(false)
  end

  def test_conditionals_forcing_individual_attributes_off
    person = new_person do |p|
      p.validates :first_name, :presence => true
      p.validates :last_name, :presence => true

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          true
        end
      end
    end

    expected_hash = {
      :last_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash(:first_name => false)
  end

  def test_conditionals_forcing_individual_validators_off
    person = new_person do |p|
      p.validates :first_name, :presence => true, :length => { :is => 5 }

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          true
        end
      end
    end

    expected_hash = {
      :first_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash(:first_name => { :length => false })
  end

  def test_conditional_proc_validators
    person = new_person do |p|
      p.validates :first_name, :presence => { :if => Proc.new { |o| o.can_validate? } }
      p.validates :last_name,  :presence => { :unless => Proc.new { |o| o.cannot_validate? } }

      p.class_eval do
        def can_validate?
          true
        end

        def cannot_validate?
          false
        end
      end
    end

    expected_hash = {
      :first_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      },
      :last_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash(true)
  end

  def test_conditionals_forced_when_used_changed_helpers
    person = new_person do |p|
      p.validates :first_name, :presence => { :if => :first_name_changed? }
      p.validates :last_name,  :presence => { :unless => :last_name_changed? }
    end

    person.stubs(:first_name_changed?).returns(true)
    person.stubs(:last_name_changed?).returns(false)

    expected_hash = {
      :first_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      },
      :last_name => {
        :presence => [{
          :message => "can't be blank"
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_multiple_validators_of_same_type_on_same_attribute
    person = new_person do |p|
      p.validates :first_name, :format => /\d/
      p.validates :first_name, :format => /\w/
    end
    expected_hash = {
      :first_name => {
        :format => [{
          :message => 'is invalid',
          :with => /\d/,
        },
        {
          :message => 'is invalid',
          :with => /\w/
        }]
      }
    }
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_ignored_procs_validators
    person = new_person do |p|
      p.validates :first_name, :format => Proc.new { |o| o.matcher }

      def matcher
        /\d/
      end
    end
    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end

  def test_validations_to_client_side_hash_with_validator_is_disabled
    ::ClientSideValidations::Config.stubs(:disabled_validators).returns([:presence])
    person = new_person do |p|
      p.validates_presence_of :first_name
    end
    expected_hash = {}
    assert_equal expected_hash, person.client_side_validation_hash
  end
end


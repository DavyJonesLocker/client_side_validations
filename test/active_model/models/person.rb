class PersonValidator < ActiveModel::Validator
  def validate(record)
  end
end

class Person
  include ActiveModel::Validations

  attr_accessor :first_name, :last_name, :email, :age

  validates_presence_of :first_name
  validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i

  def new_record?
    true
  end
end

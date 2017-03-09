# frozen_string_literal: true
users_table = %{CREATE TABLE users (id INTEGER PRIMARY KEY, age INTEGER, name TEXT, email TEXT, title VARCHAR(5), parent_id INTEGER, active BOOLEAN, type VARCHAR(255));}
ActiveRecord::Base.connection.execute(users_table)

class User < ActiveRecord::Base
  validates :email, :title, :active, :name, uniqueness: { allow_nil: true }
end

class IneptWizard < User; end
class Conjurer < IneptWizard; end
class Thaumaturgist < Conjurer; end

module ActiveRecordTestModule
  class User2 < User; end
end

class UserForm
  include ActiveRecord::Validations

  attr_accessor :name

  validates_uniqueness_of :name, client_validations: { class: User }

  def self.i18n_scope
    :activerecord
  end

  def new_record?
    true
  end
end

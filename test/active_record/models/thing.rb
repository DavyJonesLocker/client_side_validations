things_table = %{CREATE TABLE things (id INTEGER PRIMARY KEY, name text);}
ActiveRecord::Base.connection.execute(things_table)

class AbstractThing < ActiveRecord::Base
  self.abstract_class = true
end

class Thing < AbstractThing
  validates_uniqueness_of :name
end

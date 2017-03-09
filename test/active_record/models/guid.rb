# frozen_string_literal: true
guids_table = %{CREATE TABLE guids (id INTEGER PRIMARY KEY, key text);}
ActiveRecord::Base.connection.execute(guids_table)

class Guid < ActiveRecord::Base
end

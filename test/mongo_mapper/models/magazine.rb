class Magazine
  include MongoMapper::Document

  key :age,          Integer
  key :author_name,  String
  key :author_email, String
end


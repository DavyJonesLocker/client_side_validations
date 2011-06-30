class Magazine
  include MongoMapper::Document

  key :age,          Integer
  key :author_name,  String
  key :author_email, String
end

module MongoMapperTestModule
  class Magazine2 < Magazine; end
end

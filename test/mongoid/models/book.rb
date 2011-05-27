class Book
  include Mongoid::Document

  field :age, :type => Integer
  field :author_name, :type => String
  field :author_email, :type => String
end

module MongoidTestModule
  class Book2 < Book; end
end


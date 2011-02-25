class Post < Struct.new(:title, :author_name, :body, :secret, :written_on, :cost)
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  extend ActiveModel::Translation

  alias_method :secret?, :secret

  def persisted=(boolean)
    @persisted = boolean
  end

  def persisted?
    @persisted
  end

  def client_side_validation_hash
    {
      :cost => {
        :presence => {
          :message => "can't be blank"
        }
      }
    }
  end

  attr_accessor :author
  def author_attributes=(attributes); end

  attr_accessor :comments, :comment_ids
  def comments_attributes=(attributes); end

  attr_accessor :tags
  def tags_attributes=(attributes); end
end


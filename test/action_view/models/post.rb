class Post
  extend  ActiveModel::Naming
  extend  ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_accessor :title, :author_name, :body, :secret, :written_on, :cost
  validates :cost, :body, presence: true
  validates :body, length: { minimum: 200 }

  def initialize(params={})
    params.each do |attr, value|
      self.public_send("#{attr}=", value)
    end if params
  end

  def persisted?
    false
  end

  attr_accessor :comments, :comment_ids
  def comments_attributes=(attributes); end
end

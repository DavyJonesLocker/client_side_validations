class Post
  extend  ActiveModel::Naming
  extend  ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_accessor :title, :author_name, :body, :secret, :written_on, :cost
  validates :cost, :presence => true

  def initialize(params={})
    params.each do |attr, value|
      self.public_send("#{attr}=", value)
    end if params
  end

  def persisted?
    false
  end

  # alias_method :secret?, :secret

  # def persisted=(boolean)
    # @persisted = boolean
  # end

  # def persisted?
    # @persisted
  # end

  # def client_side_validation_hash
    # {
      # :cost => {
        # :presence => [{
          # :message => "can't be blank"
        # }]
      # }
    # }
  # end

  # attr_accessor :author
  # def author_attributes=(attributes); end

  attr_accessor :comments, :comment_ids
  def comments_attributes=(attributes); end

  # attr_accessor :tags
  # def tags_attributes=(attributes); end
end


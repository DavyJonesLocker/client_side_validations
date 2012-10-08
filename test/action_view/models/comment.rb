class Comment
  extend  ActiveModel::Naming
  extend  ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_reader :id, :post_id, :title
  validates :title, :presence => true

  def initialize(params={})
    params.each do |attr, value|
      self.public_send("#{attr}=", value)
    end if params
  end

  def persisted?
    false
  end
end

class Comment
  extend ActiveModel::Naming
  extend ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_reader :id, :post_id, :title, :body
  validates :title, :body, presence: true

  def initialize(params = {})
    params.each do |attr, value|
      public_send("#{attr}=", value)
    end if params
  end

  def persisted?
    false
  end
end

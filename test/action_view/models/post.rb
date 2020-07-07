# frozen_string_literal: true

class Post
  extend ActiveModel::Naming
  extend ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_accessor :title, :author_name, :body, :secret, :written_on, :cost, :comments, :comment_ids, :category, :category_id, :tags, :tag_ids

  validates :cost, :body, presence: true
  validates :body, length: { minimum: 200 }
  validates :tags, length: { minimum: 0, maximum: 3 }

  # Simulate default Rails 5's association
  validates :category, presence: { message: :required }

  def initialize(params = {})
    params.each do |attr, value|
      public_send("#{attr}=", value)
    end
  end

  def persisted?
    false
  end

  def comments_attributes=(attributes); end

  def category_attributes=(attributes); end

  def tags_attributes=(attributes); end
end

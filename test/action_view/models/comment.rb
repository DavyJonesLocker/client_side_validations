class Comment
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include ActiveModel::Validations

  attr_reader :id
  attr_reader :post_id
  attr_reader :title

  validates_presence_of :title

  def initialize(id = nil, post_id = nil); @id, @post_id = id, post_id end
  def to_key; id ? [id] : nil end
  def save; @id = 1; @post_id = 1 end
  def persisted?; @id.present? end
  def to_param; @id; end
  def name
    @id.nil? ? "new #{self.class.name.downcase}" : "#{self.class.name.downcase} ##{@id}"
  end

  attr_accessor :relevances
  def relevances_attributes=(attributes); end

  def client_side_validation_hash
    {
      :title => {
        :presence => {
          :message => "can't be blank"
        }
      }
    }
  end

end


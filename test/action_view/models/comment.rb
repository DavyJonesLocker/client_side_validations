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

  # validates_presence_of :title

  # def initialize(id = nil, post_id = nil); @id, @post_id = id, post_id end
  # def to_key; id ? [id] : nil end
  # def save; @id = 1; @post_id = 1 end
  # def persisted?; @id.present? end
  # def to_param; @id; end
  # def name
    # @id.nil? ? "new #{self.class.name.downcase}" : "#{self.class.name.downcase} ##{@id}"
  # end

  # attr_accessor :relevances
  # def relevances_attributes=(attributes); end

  # def client_side_validation_hash
    # {
      # :title => {
        # :presence => [{
          # :message => "can't be blank"
        # }]
      # }
    # }
  # end

end


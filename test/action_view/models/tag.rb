# frozen_string_literal: true

class Tag
  extend ActiveModel::Naming
  extend ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_reader :id, :title, :description

  def initialize(params = {})
    params.each do |attr, value|
      public_send("#{attr}=", value)
    end
  end

  def persisted?
    false
  end
end

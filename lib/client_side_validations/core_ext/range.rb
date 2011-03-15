class Range
  def as_json(options = nil)
    to_a
  end

  def to_json(options = nil)
    as_json(options).inspect
  end
end


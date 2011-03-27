class Range
  def as_json(options = nil)
    [first, last]
  end

  def to_json(options = nil)
    as_json(options).inspect
  end
end


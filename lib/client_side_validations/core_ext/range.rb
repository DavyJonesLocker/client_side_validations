# frozen_string_literal: true

class Range
  def as_json(*)
    [first, last]
  end

  def to_json(options = nil)
    as_json(options).inspect
  end
end

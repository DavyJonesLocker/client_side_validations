require 'active_support/json'

class Range
  def as_json(options = nil)
    [first, last]
  end
end


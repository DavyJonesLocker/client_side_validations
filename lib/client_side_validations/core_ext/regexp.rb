class Regexp
  def as_json(options = nil)
    Regexp.new inspect.sub("\\A","^").sub("\\Z","$").sub(/^\//,"").sub(/\/[a-z]*$/,""), self.options
  end

  def to_json
    inspect
  end

  def encode_json(encoder)
    inspect
  end
end


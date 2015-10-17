class Regexp
  def as_json(options = nil)
    str = inspect
      .sub('\\A' , '^')
      .sub('\\Z' , '$')
      .sub('\\z' , '$')
      .sub(/^\// , '')
      .sub(/\/[a-z]*$/ , '')
      .gsub(/\(\?#.+\)/ , '')
      .gsub(/\(\?-\w+:/ , '(')
      .gsub(/\s/ , '')
    opts = []
    opts << 'i' if (self.options & Regexp::IGNORECASE) > 0
    opts << 'm' if (self.options & Regexp::MULTILINE) > 0
    { source: Regexp.new(str).source, options: opts.join }
  end

  def to_json(options = nil)
    as_json(options)
  end

  def encode_json(encoder)
    inspect
  end
end

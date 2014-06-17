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
    Regexp.new(str).source
  end

  def to_json(options = nil)
    as_json(options)
  end

  def encode_json(encoder)
    inspect
  end
end

class Regexp
  def as_json(*)
    str = inspect
          .sub('\\A', '^')
          .sub('\\Z', '$')
          .sub('\\z', '$')
          .sub(%r{^/}, '')
          .sub(%r{/[a-z]*$}, '')
          .gsub(/\(\?#.+\)/, '')
          .gsub(/\(\?-\w+:/, '(')
          .gsub(/\s/, '')
    opts = []
    opts << 'i' if (options & Regexp::IGNORECASE) > 0
    opts << 'm' if (options & Regexp::MULTILINE) > 0
    { source: Regexp.new(str).source, options: opts.join }
  end

  def to_json(options = nil)
    as_json(options)
  end

  def encode_json(_encoder)
    inspect
  end
end

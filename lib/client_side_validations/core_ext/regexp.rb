class Regexp
  require 'js_regex'

  def as_json(*)
    JsRegex.new(self).to_h
  end

  def to_json(options = nil)
    as_json(options)
  end

  def encode_json(_encoder)
    inspect
  end
end

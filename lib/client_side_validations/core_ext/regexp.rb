class Regexp
  require 'js_regex'

  def as_json(options = nil)
    js_regex = JsRegex.new(self)
    { source: js_regex.source, options: js_regex.options }
  end

  def to_json(options = nil)
    as_json(options)
  end

  def encode_json(encoder)
    inspect
  end
end

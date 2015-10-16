# -*- encoding: utf-8 -*-

class FormatThing
  extend  ActiveModel::Naming
  extend  ActiveModel::Translation
  include ActiveModel::Validations
  include ActiveModel::Conversion

  attr_accessor :a,
                :backslash,
                :space,
                :escaped_space,
                :ascii_escape,
                :unicode_escape,
                :unicode_literal,
                :newline_escape,
                :newline_literal

  validates_format_of :a, with: /a/
  validates_format_of :backslash, with: /\\/
  validates_format_of :space, with: / /
  validates_format_of :escaped_space, with: /\ /
  validates_format_of :ascii_escape, with: /\x41/
  validates_format_of :unicode_escape, with: /\u263A/
  validates_format_of :unicode_literal, with: /☺/
  validates_format_of :newline_escape, with: /\n/
  validates_format_of :newline_literal, with: /
/

  def initialize(params={})
    params.each do |attr, value|
      self.public_send("#{attr}=", value)
    end if params
  end

  def persisted?
    false
  end
end

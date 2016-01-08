# coding: utf-8

class FormatThing
  extend ActiveModel::Naming
  extend ActiveModel::Translation
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
                :newline_literal,
                :devise_email

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

  # email regexp of devise gem
  # https://github.com/plataformatec/devise/blob/
  # 7df57d5081f9884849ca15e4fde179ef164a575f/lib/devise.rb#L109
  validates_format_of :devise_email, with: /\A[^@\s]+@([^@\s]+\.)+[^@\W]+\z/

  def initialize(params = {})
    params.each do |attr, value|
      public_send("#{attr}=", value)
    end if params
  end

  def persisted?
    false
  end
end

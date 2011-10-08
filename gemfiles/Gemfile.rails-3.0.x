source 'http://rubygems.org'

gem 'rails', '~> 3.0.0'
gem 'mocha'

if RUBY_VERSION < '1.9'
  gem 'minitest'
end

if RUBY_PLATFORM == 'java'
  gem 'activerecord-jdbcsqlite3-adapter'
else
  gem 'sqlite3'
end

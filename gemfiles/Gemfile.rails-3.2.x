source 'http://rubygems.org'

gem 'rails', '~> 3.2.0'
gem 'mocha'
gem 'coffee-script'

if RUBY_VERSION < '1.9'
  gem 'minitest'
end

if RUBY_PLATFORM == 'java'
  gem 'activerecord-jdbcsqlite3-adapter'
else
  gem 'sqlite3'
end

# frozen_string_literal: true

appraise 'rails-6.1' do
  gem 'rails', '~> 6.1.0'
  gem 'sqlite3', '~> 1.7'
  gem 'concurrent-ruby', '< 1.3.5' # Ref: rails/rails#54260
end

appraise 'rails-7.0' do
  gem 'rails', '~> 7.0.0'
  gem 'sqlite3', '~> 1.7'
  gem 'concurrent-ruby', '< 1.3.5' # Ref: rails/rails#54260
end

appraise 'rails-7.1' do
  gem 'rails', '~> 7.1.0'
end

appraise 'rails-7.2' do
  gem 'rails', '~> 7.2.0'
end

appraise 'rails-8.0' do
  gem 'rails', '~> 8.0.0'
end

appraise 'rails-edge' do
  gem 'rails', git: 'https://github.com/rails/rails.git', branch: 'main'
end

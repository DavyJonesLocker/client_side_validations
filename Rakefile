# frozen_string_literal: true

require 'bundler'
Bundler::GemHelper.install_tasks
require 'rubocop/rake_task'

RuboCop::RakeTask.new

task default: [:rubocop, 'test:ruby']

require 'rake/testtask'
namespace :test do
  desc %(Run all tests)
  task all: [:rubocop, 'test:ruby', 'test:js']

  desc %(Test Ruby code)
  Rake::TestTask.new(:ruby) do |test|
    test.libs << 'lib' << 'test'
    test.test_files = Dir.glob("#{File.dirname(__FILE__)}/test/**/test_*.rb").sort
    test.warning = false
  end

  desc %(Test Javascript code)
  multitask js: ['test:server', 'test:open']

  desc %(Starts the test server)
  task :server do
    system 'bundle exec ruby test/javascript/server.rb'
  end

  desc %(Starts the test server which reloads everything on each refresh)
  task :reloadable do
    exec "bundle exec shotgun test/javascript/config.ru -p #{PORT} --server thin"
  end

  task :open do
    url = "http://localhost:#{PORT}"
    puts "Opening test app at #{url} ..."
    sleep 3
    system(*browse_cmd(url))
  end
end

desc %(Regenerate JavaScript files)
task :regenerate_javascript do
  system 'yarn build'
end

desc %(Commit JavaScript files)
task :commit_javascript do
  perform_git_commit
end

def perform_git_commit
  system('git add dist vendor', out: File::NULL, err: File::NULL)

  if system('git commit -m "Regenerated JavaScript files"', out: File::NULL, err: File::NULL)
    puts 'Committed changes'
  else
    puts 'Nothing to commit'
  end
end

PORT = 4567

# Returns an array e.g.: ['open', 'http://example.com']
def browse_cmd(url)
  require 'rbconfig'
  browser = ENV['BROWSER'] ||
            (RbConfig::CONFIG['host_os'].include?('darwin') && 'open') ||
            (RbConfig::CONFIG['host_os'] =~ /msdos|mswin|djgpp|mingw|windows/ && 'start') ||
            %w[xdg-open x-www-browser firefox opera mozilla netscape].find { |comm| which comm }

  abort('ERROR: no web browser detected') unless browser
  Array(browser) << url
end

# which('ruby') #=> /usr/bin/ruby
def which(cmd)
  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
    exts.each do |ext|
      exe = "#{path}/#{cmd}#{ext}"
      return exe if File.executable? exe
    end
  end
  nil
end

task(:build).prerequisites.unshift task(:commit_javascript)
task(:build).prerequisites.unshift task(:regenerate_javascript)

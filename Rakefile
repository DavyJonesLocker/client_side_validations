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
    test.test_files = Dir.glob("#{__dir__}/test/**/test_*.rb").sort
    test.warning = false
  end

  desc %(Test JavaScript code)
  task js: ['regenerate_javascript', 'test:server', 'test:qunit']

  desc %(Starts the test server)
  task :server do
    puts "Opening test app at #{test_url} ..."
    server_command = 'bundle exec ruby test/javascript/server.rb'

    if ENV['UI']
      system server_command
    else
      @server = fork { exec server_command }
    end

    # Give Sinatra some time to start
    sleep 3
  end

  desc %(Starts the test server which reloads everything on each refresh)
  task :reloadable do
    exec "bundle exec shotgun test/javascript/config.ru -p #{test_port} --server thin"
  end

  desc %(Starts qunit tests)
  task :qunit do
    if ENV['UI']
      system(*browse_cmd(url))
    else
      run_headless_tests
    end
  end
end

desc %(Regenerate JavaScript files)
task :regenerate_javascript do
  run_yarn_script 'build'
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

# Returns an array e.g.: ['open', 'http://example.com']
# rubocop:disable Metrics/CyclomaticComplexity
def browse_cmd(url)
  require 'rbconfig'
  browser = ENV['BROWSER'] ||
            (RbConfig::CONFIG['host_os'].include?('darwin') && 'open') ||
            (RbConfig::CONFIG['host_os'] =~ /msdos|mswin|djgpp|mingw|windows/ && 'start') ||
            %w[xdg-open x-www-browser firefox opera mozilla netscape].find { |comm| which comm }

  abort('ERROR: no web browser detected') unless browser
  Array(browser) << url
end
# rubocop:enable Metrics/CyclomaticComplexity

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

def run_headless_tests
  run_yarn_script 'test', "#{test_url}?autostart=false" do
    Process.kill 'INT', @server
  end
end

def run_yarn_script(script, options = '')
  require 'English'

  system "yarn #{script} #{options}"
  exit_code = $CHILD_STATUS.exitstatus

  yield if block_given?

  exit exit_code unless exit_code.zero?
end

def test_port
  @test_port ||= 4567
end

def test_url
  @test_url ||= "http://localhost:#{test_port}"
end

# rubocop:disable Rake/Desc
task build: %i[regenerate_javascript commit_javascript]
# rubocop:enable Rake/Desc

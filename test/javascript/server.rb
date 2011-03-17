require 'sinatra'
require 'json'
require 'ruby-debug'

use Rack::Static, :urls => ['/javascript'], :root => File.expand_path('../..', settings.root)

helpers do
  def jquery_link version
    if params[:version] == version
      "[#{version}]"
    else
      "<a href='/?version=#{version}'>#{version}</a>"
    end
  end

  def jquery_src
    if params[:version] == 'edge' then '/vendor/jquery.js'
    else "http://code.jquery.com/jquery-#{params[:version]}.js"
    end
  end

  def test *names
    names.map { |name| script_tag name }.join("\n")
  end

  def test_base
    names = ['/vendor/qunit.js', 'settings']
    names.map { |name| script_tag name }.join("\n")
  end

  def test_validators
    Dir.glob(File.expand_path('public/test/validators', settings.root) + '/*.js').map { |file| File.basename(file) }.map do |file|
      script_tag "test/validators/#{file}"
    end.join("\n")
  end

  def script_tag src
    src = "/test/#{src}.js" unless src.index('/')
    %(<script src='#{src}' type='text/javascript'></script>)
  end
end

get '/' do
  params[:version] ||= '1.4.4'
  erb :index
end

get '/validators/uniqueness.json' do
  content_type 'application/json'
  status 200
  if params[:case_sensitive] == 'false' && (params[:user][:email] || params[:users][:email]) == 'taken@test.com'
    'false'
  else
    'true'
  end
end

post '/users' do
  data = { :params => params }.update(request.env)
  payload = data.to_json.gsub('<', '&lt;').gsub('>', '&gt;')
  <<-HTML
    <script>
      if (window.top && window.top !== window)
        window.top.jQuery.event.trigger('iframe:loaded', #{payload})
    </script>
    <p id="response">Form submitted</p>
  HTML
end


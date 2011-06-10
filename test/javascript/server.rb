require 'sinatra'
require 'json'
require 'ruby-debug'

use Rack::Static, :urls => ['/vendor/assets/javascripts'], :root => File.expand_path('../..', settings.root)

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

  def test_base
    names = ['/vendor/qunit.js', 'settings']
    names.map { |name| script_tag name }.join("\n")
  end

  def test *types
    types.map do |type|
      Dir.glob(File.expand_path("public/test/#{type}", settings.root) + '/*.js').map { |file| File.basename(file) }.map do |file|
        script_tag "/test/#{type}/#{file}"
      end.join("\n")
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

  if user = params[:user2]
    status 500
    'error'
  elsif user = params['active_record_test_module/user2']
    status 200
    'false'
  elsif scope = params[:scope]
    if scope[:name] == 'test name' || scope[:name] == 'taken name'
      status 200
      'false'
    else
      status 404
      'true'
    end
  elsif params[:case_sensitive] == 'false' && (params[:user][:email] || params[:users][:email]) == 'taken@test.com'
    status 200
    'false'
  else
    status 404
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


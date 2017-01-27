require 'bundler'
Bundler.setup
require 'sinatra'
require 'json'
require 'byebug'
require File.join(File.expand_path('../../..', __FILE__), 'coffeescript/processor')

ClientSideValidations::Processor.run

class AssetPath < Rack::Static
  def call(env)
    path = env['PATH_INFO']

    if can_serve(path)
      env['PATH_INFO'] = (path == '/' ? @index : @urls[path]) if overwrite_file_path(path)
      response = @file_server.call(env)
      if response.first == 404
        @app.call(env)
      else
        response
      end
    else
      @app.call(env)
    end
  end
end

use AssetPath, urls: ['/vendor/assets/javascripts'], root: File.expand_path('../..', settings.root)
use AssetPath, urls: ['/vendor/assets/javascripts'], root: File.expand_path('../', $LOAD_PATH.find { |p| p =~ /jquery-rails/ })

helpers do
  def test(*types)
    types.map do |type|
      Dir.glob(File.expand_path("public/test/#{type}", settings.root) + '/*.js').map { |file| File.basename(file) }.map do |file|
        script_tag "/test/#{type}/#{file}"
      end.join("\n")
    end.join("\n")
  end

  def script_tag(src)
    src = "/test/#{src}.js" unless src.index('/')
    %(<script src='#{src}' type='text/javascript'></script>)
  end
end

get '/' do
  params[:jquery] ||= '3.1.1'
  erb :index
end

post '/users' do
  data = { params: params }.update(request.env)
  payload = data.to_json.gsub('<', '&lt;').gsub('>', '&gt;')
  <<-HTML
    <script>
      if (window.top && window.top !== window)
        window.top.jQuery.event.trigger('iframe:loaded', #{payload})
    </script>
    <p id="response">Form submitted</p>
  HTML
end

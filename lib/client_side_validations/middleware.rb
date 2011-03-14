module ClientSideValidations

  class Middleware
    def initialize(app)
      @app = app
    end

    def call(env)
      case env['PATH_INFO']
      when '/validators/uniqueness.json'
        request = ActionDispatch::Request.new(env)
        unique = is_unique?(request.params)
        [200, {'Content-Type' => 'application/json', 'Content-Length' => "#{unique.length}"}, [unique]]
      else
        @app.call(env)
      end
    end

    private

    def is_unique?(params)
      resource = (params.keys - ['case_sensitive', 'id', 'scope']).first
      klass = resource.classify.constantize

      if (defined?(::ActiveRecord::Base) && klass.superclass == ::ActiveRecord::Base)
        middleware_klass = ClientSideValidations::ActiveRecord::Middleware
      elsif (defined?(::Mongoid::Document) && klass.included_modules.include?(::Mongoid::Document))
        middleware_klass = ClientSideValidations::Mongoid::Middleware
      end

      middleware_klass.is_unique?(klass, resource, params)
    end
  end

  class Engine < ::Rails::Engine
    config.app_middleware.use ClientSideValidations::Middleware
  end

end


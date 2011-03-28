# encoding: utf-8

module ClientSideValidations

  module Middleware

    class Validators
      def initialize(app)
        @app = app
      end

      def call(env)
        case env['PATH_INFO']
        when %r{\/validators\/(\w+)\.json}
          "::ClientSideValidations::Middleware::#{$1.camelize}".constantize.new(env).response
        else
          @app.call(env)
        end
      end
    end

    class Base
      attr_accessor :request, :body, :status

      def initialize(env)
        self.body    = ''
        self.status  = 200
        self.request = ActionDispatch::Request.new(env)
      end

      def response
        [status, {'Content-Type' => content_type, 'Content-Length' => body.length.to_s}, [body]]
      end

      def content_type
        'application/json'
      end
    end

    class Uniqueness < Base
      IGNORE_PARAMS = %w{case_sensitive id scope}

      def response
        if is_unique?
          self.status = 404
          self.body   = 'true'
        else
          self.status = 200
          self.body   = 'false'
        end
        super
      end

      private

      def is_unique?
        resource = extract_resource
        klass = resource.classify.constantize
        attribute = request.params[resource].keys.first
        value = request.params[resource][attribute]

        if (defined?(::ActiveRecord::Base) && klass < ::ActiveRecord::Base)
          middleware_klass = ClientSideValidations::ActiveRecord::Middleware
        elsif (defined?(::Mongoid::Document) && klass.included_modules.include?(::Mongoid::Document))
          middleware_klass = ClientSideValidations::Mongoid::Middleware
        end

        middleware_klass.is_unique?(klass, attribute, value, request.params)
      end

      def extract_resource
        parent_key = (request.params.keys - IGNORE_PARAMS).first
      end
    end

  end

  class Engine < ::Rails::Engine
    config.app_middleware.use ClientSideValidations::Middleware::Validators
  end

end


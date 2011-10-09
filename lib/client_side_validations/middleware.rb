# encoding: utf-8

require 'client_side_validations/core_ext'

module ClientSideValidations

  module Middleware
    class Validators
      def initialize(app)
        @app = app
      end

      def call(env)
        matches = /^\/validators\/(\w+)$/.match(env['PATH_INFO'])
        if !matches || (matches[1] == 'uniqueness' && Config.uniqueness_validator_disabled)
          @app.call(env)
        else
          "::ClientSideValidations::Middleware::#{matches[1].camelize}".constantize.new(env).response
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
      REGISTERED_ORMS = []

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

      def self.register_orm(orm)
        registered_orms << orm
      end

      def self.registered_orms
        REGISTERED_ORMS
      end

      def registered_orms
        self.class.registered_orms
      end

      private

      def is_unique?
        convert_scope_value_from_null_to_nil
        resource         = extract_resource
        klass            = resource.classify.constantize
        attribute        = request.params[resource].keys.first
        value            = request.params[resource][attribute]
        middleware_class = nil

        registered_orms.each do |orm|
          if orm.is_class?(klass)
            middleware_class = orm
            break
          end
        end

        middleware_class.is_unique?(klass, attribute, value, request.params)
      end

      def convert_scope_value_from_null_to_nil
        if request.params['scope']
          request.params['scope'].each do |key, value|
            if value == 'null'
              request.params['scope'][key] = nil
            end
          end
        end
      end

      def extract_resource
        parent_key = (request.params.keys - IGNORE_PARAMS).first
      end
    end
  end

end


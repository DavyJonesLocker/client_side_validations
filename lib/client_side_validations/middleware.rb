require 'client_side_validations/core_ext'

module ClientSideValidations
  module Middleware
    class Validators
      def initialize(app)
        @app = app
      end

      def call(env)
        matches = %r{\A/?#{ClientSideValidations::Config.root_path}/validators\/(\w+)\z}.match(env['PATH_INFO'])
        if matches
          process_request(matches.captures.first, env)
        else
          @app.call(env)
        end
      end

      def process_request(validation, env)
        if disabled_validators.include?(validation)
          error_resp
        else
          klass_name = validation.camelize
          klass_name = "::ClientSideValidations::Middleware::#{klass_name}"
          klass_name.constantize.new(env).response
        end
      rescue
        error_resp
      end

      def disabled_validators
        ClientSideValidations::Config.disabled_validators.map(&:to_s)
      end

      def error_resp
        [500, { 'Content-Type' => 'application/json', 'Content-Length' => '0' }, ['']]
      end
    end

    class Base
      attr_accessor :request, :body, :status

      def initialize(env)
        # Filter out cache buster
        env['QUERY_STRING'] = env['QUERY_STRING'].split('&').select { |p| !p.match(/^_=/) }.join('&')
        self.body           = ''
        self.status         = 200
        self.request        = ActionDispatch::Request.new(env)
      end

      def response
        [status, { 'Content-Type' => content_type, 'Content-Length' => body.length.to_s }, [body]]
      end

      def content_type
        'application/json'
      end
    end

    class Uniqueness < Base
      IGNORE_PARAMS = %w(case_sensitive id scope).freeze
      @@registered_orms = []
      class NotValidatable < StandardError; end

      def response
        begin
          if unique?
            self.status = 404
            self.body   = 'true'
          else
            self.status = 200
            self.body   = 'false'
          end
        rescue NotValidatable
          self.status = 500
          self.body = ''
        end
        super
      end

      def self.register_orm(orm)
        registered_orms << orm
      end

      def self.registered_orms
        @@registered_orms
      end

      def registered_orms
        self.class.registered_orms
      end

      private

      def unique?
        convert_scope_value_from_null_to_nil
        klass, attribute, value = extract_resources
        middleware_class        = nil

        unless Array.wrap(klass._validators[attribute.to_sym]).find { |v| v.kind == :uniqueness }
          raise NotValidatable
        end

        registered_orms.each do |orm|
          if orm.class?(klass)
            middleware_class = orm
            break
          end
        end

        middleware_class.unique?(klass, attribute, value, request.params)
      end

      def convert_scope_value_from_null_to_nil
        return unless request.params['scope']
        request.params['scope'].each do |key, value|
          request.params['scope'][key] = nil if value == 'null'
        end
      end

      def extract_resources
        parent_key = (request.params.keys - IGNORE_PARAMS).first

        if nested?(request.params[parent_key], 1)
          klass, attribute, value = uproot(request.params[parent_key])
          klass = klass.classify.constantize
        else
          klass            = parent_key.classify.constantize
          attribute        = request.params[parent_key].keys.first
          value            = request.params[parent_key][attribute]
        end

        [klass, attribute, value]
      end

      def uproot(nested_hash = nil)
        uproot_helper(nested_hash)[-3..-1]
      end

      def uproot_helper(nested_hash = nil, keys = [])
        if nested_hash.respond_to?(:keys)
          keys << nested_hash.keys.first
          uproot_helper(nested_hash[nested_hash.keys.first], keys)
        else
          keys << nested_hash
        end
      end

      def nested?(hash = nil, levels = 0)
        i = 0
        while hash.respond_to? :keys
          hash = hash[hash.keys.first]
          i += 1
        end
        i > levels
      end
    end
  end
end

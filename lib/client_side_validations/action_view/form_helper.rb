# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
      module FormHelper
        class Error < StandardError
        end

        def form_for(record, options = {}, &block)
          return super unless options[:validate]

          # We are not going to use super here, because we need
          # to inject the csv options in a data attribute in a clean way.
          # So we basically reimplement the whole form_for method
          raise ArgumentError, 'Missing block' unless block_given?
          html_options = options[:html] ||= {}

          # Moving the switch statement to another method to
          # lower complexity
          object, object_name = check_record(record, options)

          @validators = {}

          apply_html_options! options, html_options

          builder = instantiate_builder(object_name, object, options)
          output  = capture(builder, &block)
          html_options[:multipart] ||= builder.multipart?

          build_bound_validators! options

          apply_csv_html_options! html_options, options, builder
          html_options = html_options_for_form(options[:url] || {}, html_options)
          form_tag_with_body(html_options, output)
        end

        def apply_form_for_options!(record, object, options)
          super
          options[:html][:validate] = true if options[:validate]
        end

        def fields_for(record_name, record_object = nil, options = {}, &block)
          # Order matters here. Rails mutates the `options` object
          output = super

          build_bound_validators! options

          output
        end

        private

        def check_record(record, options)
          case record
          when String, Symbol
            raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is not supported with ClientSideValidations. Please use form_for(@resource, as: :name) instead.'
          else
            object = record.is_a?(Array) ? record.last : record
            raise ArgumentError, 'First argument in form cannot contain nil or be empty' unless object
            object_name = options[:as] || model_name_from_record_or_class(object).param_key
            apply_form_for_options!(record, object, options)
          end

          [object, object_name]
        end

        def build_bound_validators!(options)
          return unless @validators

          options[:validators].each do |key, value|
            if @validators.key?(key)
              @validators[key].merge! value
            else
              @validators[key] = value
            end
          end
        end

        def construct_validators
          @validators.each_with_object({}) do |object_opts, validator_hash|
            next unless object_opts[0].respond_to?(:client_side_validation_hash)

            option_hash = object_opts[1].each_with_object({}) do |attr, result|
              result[attr[0]] = attr[1][:options]
            end

            validation_hash = object_opts[0].client_side_validation_hash(option_hash)

            option_hash.each_key do |attr|
              add_validator validator_hash, validation_hash, object_opts[1][attr][:name], attr
            end
          end
        end

        def add_validator(validator_hash, validation_hash, name, attr)
          if validation_hash.key?(attr)
            validator_hash[name] = validation_hash[attr]
          elsif attr.to_s.ends_with?('_id')
            add_validator_with_association validator_hash, validation_hash, name, attr
          end
        end

        def add_validator_with_association(validator_hash, validation_hash, name, attr)
          association_name = attr.to_s.gsub(/_id\Z/, '').to_sym
          return unless validation_hash.key?(association_name)

          validator_hash[name] = validation_hash[association_name]
        end

        def number_format
          if ClientSideValidations::Config.number_format_with_locale && defined?(I18n)
            I18n.t('number.format').slice :separator, :delimiter
          else
            { separator: '.', delimiter: ',' }
          end
        end

        def apply_html_options!(options, html_options)
          # Turn off HTML5 validations
          html_options[:novalidate] = 'novalidate'

          html_options[:data]   = options.delete(:data)   if options.key?(:data)
          html_options[:remote] = options.delete(:remote) if options.key?(:remote)
          html_options[:method] = options.delete(:method) if options.key?(:method)
          html_options[:enforce_utf8] = options.delete(:enforce_utf8) if options.key?(:enforce_utf8)
          html_options[:authenticity_token] = options.delete(:authenticity_token)
        end

        def apply_csv_html_options!(html_options, options, builder)
          html_options.delete :validate

          csv_options = {
            html_settings: builder.client_side_form_settings(options, self),
            number_format: number_format,
            validators: construct_validators
          }

          html_options['data-client-side-validations'] = csv_options.to_json
        end
      end
    end
  end
end

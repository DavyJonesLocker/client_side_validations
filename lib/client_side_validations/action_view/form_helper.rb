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
              next unless validation_hash.key?(attr)
              validator_hash[object_opts[1][attr][:name]] = validation_hash[attr]
            end
          end
        end

        def client_side_form_settings(options, builder)
          javascript_tag "if(window.ClientSideValidations===undefined)window.ClientSideValidations={};window.ClientSideValidations.disabled_validators=#{ClientSideValidations::Config.disabled_validators.to_json};window.ClientSideValidations.number_format=#{number_format.to_json};if(window.ClientSideValidations.patterns===undefined)window.ClientSideValidations.patterns = {};window.ClientSideValidations.patterns.numericality=#{numericality_patterns};#{"if(window.ClientSideValidations.remote_validators_prefix===undefined)window.ClientSideValidations.remote_validators_prefix='#{ClientSideValidations::Config.root_path.sub(%r{/+\Z}, '')}';" if ClientSideValidations::Config.root_path.present?}if(window.ClientSideValidations.forms===undefined)window.ClientSideValidations.forms={};window.ClientSideValidations.forms['#{options[:html]['id']}'] = #{builder.client_side_form_settings(options, self).merge(validators: construct_validators).to_json};"
        end

        def number_format
          @number_format ||=
            if ClientSideValidations::Config.number_format_with_locale && defined?(I18n)
              I18n.t('number.format').slice :separator, :delimiter
            else
              { separator: '.', delimiter: ',' }
            end
        end

        def numericality_patterns
          "/^(-|\\+)?(?:\\d+|\\d{1,3}(?:\\#{number_format[:delimiter]}\\d{3})+)(?:\\#{number_format[:separator]}\\d*)?$/"
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

          csv_options = default_csv_html_options.tap do |opts|
            opts[:html_settings] = builder.client_side_form_settings(options, self)
            opts[:remote_validators_prefix] = ClientSideValidations::Config.root_path.sub(%r{/+\Z}, '') if ClientSideValidations::Config.root_path.present?
            opts[:validators] = construct_validators
          end

          html_options['data-client-side-validations'] = csv_options.to_json
        end

        def default_csv_html_options
          {
            disabled_validators: ClientSideValidations::Config.disabled_validators,
            number_format: number_format,
            patterns: {
              numericality: numericality_patterns
            }
          }
        end
      end
    end
  end
end

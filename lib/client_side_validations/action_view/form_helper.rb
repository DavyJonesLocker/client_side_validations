# frozen_string_literal: true
module ClientSideValidations
  module ActionView
    module Helpers
      module FormHelper
        class Error < StandardError
        end

        def form_for(record, options = {}, &block)
          return super unless options[:validate]

          # Always turn off HTML5 Validations
          options[:html] ||= {}
          options[:html][:novalidate] = 'novalidate'

          case record
          when String, Symbol
            raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is not supported with ClientSideValidations. Please use form_for(@resource, as: :name) instead.'
          else
            object = record.is_a?(Array) ? record.last : record
            object_name = options[:as] || model_name_from_record_or_class(object).param_key
          end

          @validators = {}

          # Order matters here. Rails mutates the `options` object
          form = super

          build_bound_validators! options
          builder = instantiate_builder(object_name, object, options)
          script = client_side_form_settings(options, builder)

          if assign_script_to_content_for(options[:validate], script)
            form
          else
            # rubocop:disable OutputSafety
            [form, script].join.html_safe
            # rubocop:enable OutputSafety
          end
        end

        def assign_script_to_content_for(name, script)
          return false unless name && name != true

          # rubocop:disable OutputSafety
          content_for name, script.html_safe
          # rubocop:enable OutputSafety

          true
        end

        def apply_form_for_options!(record, object, options)
          super
          options[:html][:validate] = true if options[:validate]
        end

        def fields_for(record_or_name_or_array, record_object = nil, options = {}, &block)
          # Order matters here. Rails mutates the `options` object
          output = super

          build_bound_validators! options

          output
        end

        private

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
            option_hash = object_opts[1].each_with_object({}) do |attr, result|
              result[attr[0]] = attr[1][:options]
            end

            validation_hash =
              if object_opts[0].respond_to?(:client_side_validation_hash)
                object_opts[0].client_side_validation_hash(option_hash)
              else
                {}
              end

            option_hash.each_key do |attr|
              if validation_hash[attr]
                validator_hash.merge!(object_opts[1][attr][:name] => validation_hash[attr])
              end
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
      end
    end
  end
end

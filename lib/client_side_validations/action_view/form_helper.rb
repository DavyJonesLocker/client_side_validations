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
          raise ArgumentError, 'Missing block' unless block

          options[:html] ||= {}

          # Moving the switch statement to another method to
          # lower complexity
          model, object_name = check_record(record, options)

          remote = options.delete(:remote)

          if remote && !embed_authenticity_token_in_remote_forms && options[:authenticity_token].blank?
            options[:authenticity_token] = false
          end

          options[:model] = model
          options[:scope] = object_name
          options[:local] = !remote
          options[:skip_default_ids] = false
          options[:allow_method_names_outside_object] = options.fetch(:allow_method_names_outside_object, false)

          form_with(**options, &block)
        end

        def apply_csv_form_for_options!(record, object, options)
          options[:html][:validate] = true if options[:validate]

          if method(:apply_form_for_options!).arity == 2
            apply_form_for_options! object, options
          else
            apply_form_for_options! record, object, options
          end
        end

        def fields_for(record_name, record_object = nil, options = {}, &block)
          # Order matters here. Rails mutates the `options` object
          builder = instantiate_builder(record_name, record_object, options)
          output = capture(builder, &block)

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
            apply_csv_form_for_options!(record, object, options)
          end

          [record, object_name]
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
          elsif attr.to_s.end_with?('_id')
            association_name = attr.to_s.gsub(/_id\Z/, '').to_sym
            add_validator_with_association validator_hash, validation_hash, name, association_name
          elsif attr.to_s.end_with?('_ids')
            association_name = attr.to_s.gsub(/_ids\Z/, '').pluralize.to_sym
            add_validator_with_association validator_hash, validation_hash, name, association_name
          end
        end

        def add_validator_with_association(validator_hash, validation_hash, name, association_name)
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

        def apply_csv_html_options!(html_options, options, builder)
          html_options.delete 'validate'

          csv_options = {
            html_settings: builder.client_side_form_settings(options, self),
            number_format: number_format,
            validators:    construct_validators
          }

          html_options['data-client-side-validations'] = csv_options.to_json
        end
      end
    end
  end
end

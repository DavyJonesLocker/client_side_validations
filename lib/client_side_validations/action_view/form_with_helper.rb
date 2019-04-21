# frozen_string_literal: true

# rubocop:disable Metrics/AbcSize, Metrics/MethodLength
module ClientSideValidations
  module ActionView
    module Helpers
      module FormHelper
        def form_with(model: nil, scope: nil, url: nil, format: nil, **options)
          return super unless options[:validate]

          options[:allow_method_names_outside_object] = true
          options[:skip_default_ids] = !try(:form_with_generates_ids)

          if model
            url ||= polymorphic_path(model, format: format)

            model   = model.last if model.is_a?(Array)
            scope ||= model_name_from_record_or_class(model).param_key
          end

          if block_given?
            @validators = {}

            builder = instantiate_builder(scope, model, options)
            output  = capture(builder, &Proc.new)
            options[:multipart] ||= builder.multipart?

            build_bound_validators! options

            html_options = html_options_for_form_with(url, model, options)

            if model
              html_options[:novalidate] ||= 'novalidate'
              apply_csv_html_options! html_options, options, builder
            end

            form_tag_with_body(html_options, output)
          else
            html_options = html_options_for_form_with(url, model, options)
            form_tag_html(html_options)
          end
        end
      end
    end
  end
end
# rubocop:enable Metrics/AbcSize, Metrics/MethodLength

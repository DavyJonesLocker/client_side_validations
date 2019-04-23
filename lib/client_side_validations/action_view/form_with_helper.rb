# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
      module FormHelper
        def form_with(model: nil, scope: nil, url: nil, format: nil, **options, &block)
          return super unless options[:validate]

          options[:allow_method_names_outside_object] = true
          options[:skip_default_ids] = false

          url, model, scope = check_model(url, model, format, scope) if model

          if block_given?
            form_tag_with_validators scope, model, options, url, &block
          else
            html_options = html_options_for_form_with(url, model, options)
            form_tag_html(html_options)
          end
        end

        private

        def check_model(url, model, format, scope)
          url ||= polymorphic_path(model, format: format)

          model   = model.last if model.is_a?(Array)
          scope ||= model_name_from_record_or_class(model).param_key

          [url, model, scope]
        end

        def form_tag_with_validators(scope, model, options, url)
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
        end
      end
    end
  end
end

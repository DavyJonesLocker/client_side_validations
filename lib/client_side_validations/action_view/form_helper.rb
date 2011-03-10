module ClientSideValidations::ActionView::Helpers
  module FormHelper
    class Error < StandardError; end

    def form_for(record_or_name_or_array, *args, &proc)
      options = args.extract_options!
      if options[:validate]

        # Turn off SimpleForm's HTML5 Form Validations
        if options[:builder].to_s == 'SimpleForm::FormBuilder'
          options[:html][:novalidate] = true
        end

        case record_or_name_or_array
        when String, Symbol
          raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is deprecated in Rails and is not supported with ClientSideValidations. Please use form_for(@resource, :as => :name) instead.'
        when Array
          object = record_or_name_or_array.last
        else
          object = record_or_name_or_array
        end
      end

      "#{super(record_or_name_or_array, *(args << options), &proc)}#{client_side_form_js_variable(object, options)}".html_safe
    end

    def apply_form_for_options!(object_or_array, options)
      super
      options[:html][:validate] = true if options[:validate]
    end

    private

    def client_side_form_js_variable(object, options)
      if options[:validate]
        builder = options[:builder] || ActionView::Base.default_form_builder

        var_name = if object.respond_to?(:persisted?) && object.persisted?
          options[:as] ? "#{options[:as]}_edit" : dom_id(object, :edit)
        else
          options[:as] ? "#{options[:as]}_new" : dom_id(object)
        end

        content_tag(:script) do
          "var #{var_name} = #{builder.client_side_form_js_hash(options, self).to_json};".html_safe
        end

      end
    end

  end
end


module ClientSideValidations::ActionView::Helpers
  module FormHelper
    class Error < StandardError; end

    def form_for(record_or_name_or_array, *args, &proc)
      options = args.extract_options!
      if options[:validate]

        content_for_name = options[:validate] unless options[:validate] == true

        # Always turn off HTML5 Validations
        options[:html] ||= {}
        options[:html][:novalidate] = 'novalidate'

        case record_or_name_or_array
        when String, Symbol
          raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is deprecated in Rails and is not supported with ClientSideValidations. Please use form_for(@resource, :as => :name) instead.'
        when Array
          object = record_or_name_or_array.last
        else
          object = record_or_name_or_array
        end
      end

      @validators = {}
      # Order matters here. Rails mutates the options object
      script = client_side_form_settings(object, options)
      form   = super(record_or_name_or_array, *(args << options), &proc)
      # Because of the load order requirement above this sub is necessary
      # Would be nice to not do this
      script = insert_validators_into_script(script)
      if content_for_name
        content_for(content_for_name) { script.html_safe }
        script = nil
      end
      "#{form}#{script}".html_safe
    end

    def apply_form_for_options!(object_or_array, options)
      super
      options[:html][:validate] = true if options[:validate]
    end

    def fields_for(record_or_name_or_array, *args, &block)
      output = super
      @validators.merge!(args.last[:validators]) if @validators
      output
    end

    private

    def insert_validators_into_script(script)
      # There is probably a more performant way of doing this
      # But using String#sub has some issues. Undocumented "features"
      if script
        script = script.split(/"validator_hash"/)
        script = "#{script[0]}#{@validators.to_json}#{script[1]}"
      end

      script
    end

    def client_side_form_settings(object, options)
      if options[:validate]
        builder = options[:builder] || ActionView::Base.default_form_builder

        if options[:html] && options[:html][:id]
          var_name = options[:html][:id]
        else
          var_name = if object.respond_to?(:persisted?) && object.persisted?
            options[:as] ? "#{options[:as]}_edit" : dom_id(object, :edit)
          else
            options[:as] ? "#{options[:as]}_new" : dom_id(object)
          end
        end

        content_tag(:script) do
          "if(window['clientSideValidations'] === undefined) window['clientSideValidations'] = {};
          if(window['clientSideValidations']['forms'] === undefined) window['clientSideValidations']['forms'] = {};
          window['clientSideValidations']['forms']['#{var_name}'] = #{builder.client_side_form_settings(options, self).merge(:validators => 'validator_hash').to_json};".html_safe
        end

      end
    end

  end
end


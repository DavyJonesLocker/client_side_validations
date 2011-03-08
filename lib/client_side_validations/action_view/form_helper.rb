module ClientSideValidations::ActionView::Helpers
  module FormHelper
    class Error < StandardError; end

    def form_for(record_or_name_or_array, *args, &proc)
      options = args.extract_options!
      if options[:validate]
        case record_or_name_or_array
        when String, Symbol
          raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is deprecated in Rails and is not supported with ClientSideValidations. Please use form_for(@resource, :as => :name) instead.'
        end
      end

      "#{super(record_or_name_or_array, *(args << options), &proc)}#{client_side_validations_error_field_partials(options[:validate])}".html_safe
    end

    def apply_form_for_options!(object_or_array, options)
      super
      options[:html][:validate] = true if options[:validate]
    end

    private

    def client_side_validations_error_field_partials(validate)
      if validate
        content_tag(:script) do
          %Q{var inputFieldErrorPartial = "#{escape_javascript(self.class.field_error_proc.call(%{<span id="input_tag" />}, Struct.new(:error_message, :tag_id).new([], "")))}";}.html_safe +
          %Q{var labelFieldErrorPartial = "#{escape_javascript(self.class.field_error_proc.call(%{<label id="label_tag" />}))}";}.html_safe
        end
      end
    end

  end

  module FormBuilder

    def self.included(base)
      (base.field_helpers - %w(apply_form_for_options! label check_box radio_button fields_for hidden_field)).each do |selector|
        base.class_eval <<-RUBY_EVAL
          def #{selector}_with_client_side_validations(method, options = {})
            apply_client_side_validators(method, options)
            options.delete(:validate)
            #{selector}_without_client_side_validations(method, options)
          end
        RUBY_EVAL

        base.class_eval { alias_method_chain selector, :client_side_validations }
      end

      base.class_eval do
        alias_method_chain :fields_for, :client_side_validations
        alias_method_chain :check_box, :client_side_validations
        alias_method_chain :radio_button, :client_side_validations
      end
    end

    def fields_for_with_client_side_validations(record_or_name_or_array, *args, &block)
      options = args.extract_options!
      options[:validate] ||= @options[:validate] if @options[:validate] && !options.key?(:validate)
      fields_for_without_client_side_validations(record_or_name_or_array, *(args << options), &block)
    end

    def check_box_with_client_side_validations(method, options = {}, checked_value = "1", unchecked_value = "0")
      apply_client_side_validators(method, options)
      check_box_without_client_side_validations(method, options, checked_value, unchecked_value)
    end

    def radio_button_with_client_side_validations(method, tag_value, options = {})
      apply_client_side_validators(method, options)
      radio_button_without_client_side_validations(method, tag_value, options)
    end

    private
      def apply_client_side_validators(method, options = {})
        if @options[:validate] && options[:validate] != false && validators = @object.client_side_validation_hash[method]
          options.merge!("data-validators" => validators.to_json)
        end
      end

  end
end

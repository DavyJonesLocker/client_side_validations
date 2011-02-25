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

      super(record_or_name_or_array, *(args << options), &proc)
    end

    def apply_form_for_options!(object_or_array, options)
      super
      options[:html][:validate] = true if options[:validate]
    end

  end

  module FormBuilder

    def self.included(base)
      (base.field_helpers - %w(apply_form_for_options! label check_box radio_button fields_for hidden_field)).each do |selector|
        base.class_eval <<-RUBY_EVAL
          def #{selector}_with_client_side_validations(method, options = {})
            apply_client_side_validators(method, options)
            #{selector}_without_client_side_validations(method, options)
          end
        RUBY_EVAL

        base.class_eval { alias_method_chain selector, :client_side_validations }
      end

      base.class_eval do
        alias_method_chain :check_box, :client_side_validations
        alias_method_chain :radio_button, :client_side_validations
      end
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
        if @options[:validate] && validators = @object.client_side_validation_hash[method]
          options.merge!("data-validators" => validators.to_json)
        end
      end

  end
end

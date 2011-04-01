module ClientSideValidations::ActionView::Helpers
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
        alias_method_chain :initialize,   :client_side_validations
        alias_method_chain :fields_for,   :client_side_validations
        alias_method_chain :check_box,    :client_side_validations
        alias_method_chain :radio_button, :client_side_validations

        def self.client_side_form_settings(options, form_helper)
          {
            :type => self.to_s,
            :input_tag => form_helper.class.field_error_proc.call(%{<span id="input_tag" />}, Struct.new(:error_message, :tag_id).new([], "")),
            :label_tag => form_helper.class.field_error_proc.call(%{<label id="label_tag" />})
          }
        end
      end
    end

    def initialize_with_client_side_validations(object_name, object, template, options, proc)
      initialize_without_client_side_validations(object_name, object, template, options, proc)
      @options[:validators] = {}
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
        options.merge!("data-validate" => true)
        @options[:validators].merge!("#{@object_name}[#{method}]" => validators)
      end
    end

  end
end

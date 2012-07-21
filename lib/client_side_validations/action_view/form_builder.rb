module ClientSideValidations::ActionView::Helpers
  module FormBuilder

    def self.included(base)
      (base.field_helpers.map(&:to_s) - %w(apply_form_for_options! label check_box radio_button fields_for hidden_field)).each do |selector|
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
        alias_method_chain :initialize,                :client_side_validations
        alias_method_chain :fields_for,                :client_side_validations
        alias_method_chain :check_box,                 :client_side_validations
        alias_method_chain :radio_button,              :client_side_validations
        alias_method_chain :select,                    :client_side_validations
        alias_method_chain :collection_select,         :client_side_validations
        alias_method_chain :grouped_collection_select, :client_side_validations
        alias_method_chain :time_zone_select,          :client_side_validations

        def client_side_form_settings(options, form_helper)
          {
            :type => self.class.to_s,
            :input_tag => form_helper.class.field_error_proc.call(%{<span id="input_tag" />},  Struct.new(:error_message, :tag_id).new([], "")),
            :label_tag => form_helper.class.field_error_proc.call(%{<label id="label_tag" />}, Struct.new(:error_message, :tag_id).new([], ""))
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

    def select_with_client_side_validations(method, choices, options = {}, html_options = {})
      apply_client_side_validators(method, html_options)
      select_without_client_side_validations(method, choices, options, html_options)
    end

    def collection_select_with_client_side_validations(method, collection, value_method, text_method, options = {}, html_options = {})
      apply_client_side_validators(method, html_options)
      collection_select_without_client_side_validations(method, collection, value_method, text_method, options, html_options)
    end

    def grouped_collection_select_with_client_side_validations(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
      apply_client_side_validators(method, html_options)
      grouped_collection_select_without_client_side_validations(method, collection, group_method, group_label_method, option_key_method, option_value_method, options, html_options)
    end

    def time_zone_select_with_client_side_validations(method, priority_zones = nil, options = {}, html_options = {})
      apply_client_side_validators(method, html_options)
      time_zone_select_without_client_side_validations(method, priority_zones = nil, options, html_options)
    end

  private

    def apply_client_side_validators(method, options = {})
      if @options[:validate] && options[:validate] != false && validators = filter_validators(method, options[:validate])
        options.merge!("data-validate" => true)
        name = options[:name] || "#{@object_name}[#{method}]"
        child_index = @options[:child_index] ? "(\\d+|#{Regexp.escape(@options[:child_index])})" : "\\d+"
        name = name.gsub(/_attributes\]\[#{child_index}\]/, '_attributes][]')
        @options[:validators].merge!("#{name}#{options[:multiple] ? "[]" : nil}" => validators)
      end
    end

    def filter_validators(method, filters)
      if validators = @object.client_side_validation_hash[method]
        unfiltered_validators = validators.inject({}) do |unfiltered_validators, validator|
          kind = validator.first
          unfiltered_validators[kind] = validator.last.inject([]) do |validators_array, validator_hash|
            if has_filter_for_validator?(kind, filters)
              if filter_validator?(kind, filters)
                next
              elsif force_validator_despite_conditional?(kind, filters) && !can_run_validator?(validator_hash, method)
                next
              end
            else
              if (conditional = (validator_hash[:if] || validator_hash[:unless]))
                result = case conditional
                  when Symbol
                    if @object.respond_to?(conditional)
                      @object.send(conditional)
                    else
                      raise(ArgumentError, "unknown method called '#{conditional}'")
                    end
                  when String
                    eval(conditional)
                  when Proc
                    conditional.call(@object)
                  end

                # :if was specified and result is false OR :unless was specified and result was true
                if (validator_hash[:if] && !result) || (validator_hash[:unless] && result)
                  next
                end
              end

            end

            validators_array << validator_hash.clone
            validators_array.last.delete_if { |key, value| key == :if || key == :unless }
            validators_array
          end

          unfiltered_validators
        end

        unfiltered_validators.delete_if { |k, v| v.nil? }
        unfiltered_validators.empty? ? nil : unfiltered_validators
      end
    end

    def has_filter_for_validator?(kind, filters)
      filters && (filters == true || filters.key?(kind))
    end

    def filter_validator?(kind, filters)
      filters != true && filters[kind] == false
    end

    def force_validator_despite_conditional?(kind, filters)
      filters == true || filters[kind] == true
    end

    def can_run_validator?(validator_hash, method)
      result        = true
      if_result     = run_if_validator(validator_hash[:if], method)
      unless_result = run_unless_validator(validator_hash[:unless], method)
      result        = result && if_result unless if_result.nil?
      result        = result && unless_result unless unless_result.nil?
      result
    end

    def run_if_validator(conditional, method)
      if conditional
        if conditional.is_a?(Symbol)
          conditional_method_is_change_method?(conditional, method) ? true : !!@object.send(conditional)
        else
          !!conditional.call(@object)
        end
      end
    end

    def run_unless_validator(conditional, method)
      if conditional
        if conditional.is_a?(Symbol)
          conditional_method_is_change_method?(conditional, method) ? true : !@object.send(conditional)
        else
          !conditional.call(@object)
        end
      end
    end

    def conditional_method_is_change_method?(conditional, method)
      conditional.to_sym == "#{method}_changed?".to_sym
    end
  end
end

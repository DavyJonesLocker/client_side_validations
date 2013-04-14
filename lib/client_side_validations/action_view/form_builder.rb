module ClientSideValidations::ActionView::Helpers
  module FormBuilder

    def self.included(base)
      (base.field_helpers.map(&:to_s) - %w(apply_form_for_options! label check_box radio_button fields_for hidden_field)).each do |selector|
        base.class_eval <<-RUBY_EVAL
          def #{selector}_with_client_side_validations(method, options = {})
            build_validation_options(method, options)
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

    def validate(*attrs)
      options = attrs.pop if attrs.last.is_a?(Hash)
      (attrs.present? ? attrs : @object._validators.keys).each do |attr|
        build_validation_options(attr, :validate => options)
      end
      nil
    end

    def initialize_with_client_side_validations(object_name, object, template, options, proc)
      initialize_without_client_side_validations(object_name, object, template, options, proc)
      @options[:validators] = { object => {} }
    end

    def fields_for_with_client_side_validations(record_or_name_or_array, *args, &block)
      options = args.extract_options!
      options[:validate] ||= @options[:validate] if @options[:validate] && !options.key?(:validate)
      fields_for_without_client_side_validations(record_or_name_or_array, *(args << options), &block)
    end

    def check_box_with_client_side_validations(method, options = {}, checked_value = "1", unchecked_value = "0")
      build_validation_options(method, options)
      options.delete(:validate)
      check_box_without_client_side_validations(method, options, checked_value, unchecked_value)
    end

    def radio_button_with_client_side_validations(method, tag_value, options = {})
      build_validation_options(method, options)
      options.delete(:validate)
      radio_button_without_client_side_validations(method, tag_value, options)
    end

    def select_with_client_side_validations(method, choices, options = {}, html_options = {})
      build_validation_options(method, html_options.merge(:name => options[:name]))
      html_options.delete(:validate)
      select_without_client_side_validations(method, choices, options, html_options)
    end

    def collection_select_with_client_side_validations(method, collection, value_method, text_method, options = {}, html_options = {})
      build_validation_options(method, html_options.merge(:name => options[:name]))
      html_options.delete(:validate)
      collection_select_without_client_side_validations(method, collection, value_method, text_method, options, html_options)
    end

    def grouped_collection_select_with_client_side_validations(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
      build_validation_options(method, html_options.merge(:name => options[:name]))
      html_options.delete(:validate)
      grouped_collection_select_without_client_side_validations(method, collection, group_method, group_label_method, option_key_method, option_value_method, options, html_options)
    end

    def time_zone_select_with_client_side_validations(method, priority_zones = nil, options = {}, html_options = {})
      build_validation_options(method, html_options.merge(:name => options[:name]))
      html_options.delete(:validate)
      time_zone_select_without_client_side_validations(method, priority_zones, options, html_options)
    end

  private

    def build_validation_options(method, options = {})
      if @options[:validate]
        index = @default_options[:index].present? ? "[#{@default_options[:index]}]" : ''
        name = options[:name] || "#{@object_name}#{index}[#{method}]"
        child_index = @options[:child_index] ? "(\\d+|#{Regexp.escape(@options[:child_index].to_s)})" : "\\d+"
        name = name.to_s.gsub(/_attributes\]\[#{child_index}\]/, '_attributes][]')
        name = "#{name}#{options[:multiple] ? "[]" : nil}"
        @options[:validators][@object][method] = { :name => name, :options => options[:validate] }
      end
    end
  end
end

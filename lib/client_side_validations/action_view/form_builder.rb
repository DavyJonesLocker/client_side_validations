# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
      module FormBuilder
        def self.prepended(base)
          (base.field_helpers - %i[label check_box radio_button fields_for hidden_field file_field]).each do |selector|
            base.class_eval <<-RUBY_EVAL
              def #{selector}(method, options = {})
                build_validation_options(method, options)
                options.delete(:validate)

                # Cannot call super here, override the whole method
                @template.send(                      #   @template.send(
                  #{selector.inspect},               #     "text_field",
                  @object_name,                      #     @object_name,
                  method,                            #     method,
                  objectify_options(options))        #     objectify_options(options))
              end
            RUBY_EVAL
          end
        end

        def client_side_form_settings(_options, form_helper)
          {
            type: self.class.to_s,
            input_tag: form_helper.class.field_error_proc.call(%(<span id="input_tag" />),  Struct.new(:error_message, :tag_id).new([], '')),
            label_tag: form_helper.class.field_error_proc.call(%(<label id="label_tag" />), Struct.new(:error_message, :tag_id).new([], ''))
          }
        end

        def validate(*attrs)
          options = attrs.pop if attrs.last.is_a?(Hash)
          (attrs.present? ? attrs : @object._validators.keys).each do |attr|
            build_validation_options(attr, validate: options)
          end
          nil
        end

        def initialize(object_name, object, template, options)
          super(object_name, object, template, options)
          @options[:validators] = { object => {} }
        end

        def fields_for(record_name, record_object = nil, fields_options = {}, &block)
          if record_object.is_a?(Hash) && record_object.extractable_options?
            fields_options = record_object
            record_object  = nil
          end

          fields_options[:validate] ||= @options[:validate] if @options[:validate] && !fields_options.key?(:validate)
          super(record_name, record_object, fields_options, &block)
        end

        def check_box(method, options = {}, checked_value = '1', unchecked_value = '0')
          build_validation_options(method, options)
          options.delete(:validate)
          super(method, options, checked_value, unchecked_value)
        end

        def radio_button(method, tag_value, options = {})
          build_validation_options(method, options)
          options.delete(:validate)
          super(method, tag_value, options)
        end

        def select(method, choices = nil, options = {}, html_options = {}, &block)
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super(method, choices, options, html_options, &block)
        end

        def collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super(method, collection, value_method, text_method, options, html_options)
        end

        %i[collection_check_boxes collection_radio_buttons].each do |method_name|
          define_method method_name do |method, collection, value_method, text_method, options = {}, html_options = {}, &block|
            build_validation_options(method, html_options.merge(name: options[:name]))
            html_options.delete(:validate)
            super(method, collection, value_method, text_method, options, html_options, &block)
          end
        end

        def grouped_collection_select(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super(method, collection, group_method, group_label_method, option_key_method, option_value_method, options, html_options)
        end

        def time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super(method, priority_zones, options, html_options)
        end

        def file_field(method, options = {})
          build_validation_options(method, options)
          options.delete(:validate)
          super(method, options)
        end

        private

        def build_validation_options(method, options = {})
          return unless @options[:validate]

          index       = @default_options[:index].present? ? "[#{@default_options[:index]}]" : ''
          child_index = @options[:child_index] ? "(\\d+|#{Regexp.escape(@options[:child_index].to_s)})" : '\\d+'

          name = options[:name] || "#{@object_name}#{index}[#{method}]"
          name = name.to_s.gsub(/_attributes\]\[#{child_index}\]/, '_attributes][]')
          name << '[]' if options[:multiple]

          @options[:validators][@object][method] = { name: name, options: options[:validate] }
        end
      end
    end
  end
end

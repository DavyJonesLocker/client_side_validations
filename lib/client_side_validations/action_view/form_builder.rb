# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
      module FormBuilder
        def self.prepended(base)
          (base.field_helpers - %i[label check_box radio_button fields_for fields hidden_field file_field]).each do |selector|
            base.class_eval <<-RUBY_EVAL, __FILE__, __LINE__ + 1
              # Cannot call super here, rewrite all
              def #{selector}(method, options = {})       # def text_field(method, options = {})
                build_validation_options(method, options) #   build_validation_options(method, options)
                options.delete(:validate)                 #   options.delete(:validate)
                @template.send(                           #   @template.send(
                  #{selector.inspect},                    #     "text_field",
                  @object_name,                           #     @object_name,
                  method,                                 #     method,
                  objectify_options(options))             #     objectify_options(options))
              end                                         # end
            RUBY_EVAL
          end
        end

        def initialize(object_name, object, template, options)
          super
          @options[:validators] = { object => {} }
        end

        def client_side_form_settings(_options, form_helper)
          {
            type:      self.class.name,
            input_tag: error_field(form_helper, :span, 'input_tag'),
            label_tag: error_field(form_helper, :label, 'label_tag')
          }
        end

        def validate(*attrs)
          options = attrs.pop if attrs.last.is_a?(Hash)
          (attrs.presence || @object._validators.keys).each do |attr|
            build_validation_options(attr, validate: options)
          end
          nil
        end

        def check_box(method, options = {}, checked_value = '1', unchecked_value = '0')
          build_validation_options(method, options)
          options.delete(:validate)
          super
        end

        %i[collection_check_boxes collection_radio_buttons].each do |method_name|
          define_method method_name do |method, collection, value_method, text_method, options = {}, html_options = {}, &block|
            build_validation_options(method, html_options.merge(name: options[:name]))
            html_options.delete(:validate)
            super(method, collection, value_method, text_method, options, html_options, &block)
          end
        end

        def collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super
        end

        def fields_for(record_name, record_object = nil, fields_options = {}, &block)
          if record_object.is_a?(Hash) && record_object.extractable_options?
            fields_options = record_object
            record_object  = nil
          end

          fields_options[:validate] ||= @options[:validate] if @options[:validate] && !fields_options.key?(:validate)
          super
        end

        def fields(scope = nil, model: nil, **options, &block)
          options[:validate] ||= @options[:validate] if @options[:validate] && !options.key?(:validate)
          super
        end

        def file_field(method, options = {})
          build_validation_options(method, options)
          options.delete(:validate)
          super
        end

        def grouped_collection_select(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super
        end

        def radio_button(method, tag_value, options = {})
          build_validation_options(method, options)
          options.delete(:validate)
          super
        end

        def select(method, choices = nil, options = {}, html_options = {}, &block)
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super
        end

        def time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]))
          html_options.delete(:validate)
          super
        end

        private

        def error_field(form_helper, tag, id)
          form_helper.instance_exec form_helper.content_tag(tag, nil, id: id),
                                    Struct.new(:error_message, :tag_id).new([], ''),
                                    &form_helper.class.field_error_proc
        end

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

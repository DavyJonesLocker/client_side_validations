# frozen_string_literal: true

module ClientSideValidations
  module ActionView
    module Helpers
      module FormBuilder
        def self.prepended(base)
          selectors = base.field_helpers - %i[label check_box checkbox radio_button fields_for fields hidden_field file_field]

          selectors.each do |selector|
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

          base.class_eval do
            alias_method :text_area, :textarea if ::ActionView::Helpers::FormBuilder.field_helpers.include?(:textarea)
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
        alias checkbox check_box if ::ActionView::Helpers::FormBuilder.field_helpers.include?(:checkbox)

        %i[collection_check_boxes collection_radio_buttons].each do |method_name|
          define_method method_name do |method, collection, value_method, text_method, options = {}, html_options = {}, &block|
            build_validation_options(method, html_options.merge(name: options[:name]), html_options)
            html_options.delete(:validate)
            super(method, collection, value_method, text_method, options, html_options, &block)
          end
        end

        if ::ActionView::Helpers::FormBuilder.public_method_defined?(:collection_checkboxes)
          alias collection_checkboxes collection_check_boxes
        end

        def collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]), html_options)
          html_options.delete(:validate)
          super
        end

        def fields_for(record_name, record_object = nil, fields_options = {}, &)
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
          build_validation_options(method, html_options.merge(name: options[:name]), html_options)
          html_options.delete(:validate)
          super
        end

        def radio_button(method, tag_value, options = {})
          build_validation_options(method, options)
          options.delete(:validate)
          super
        end

        def select(method, choices = nil, options = {}, html_options = {}, &)
          build_validation_options(method, html_options.merge(name: options[:name]), html_options)
          html_options.delete(:validate)
          super
        end

        def time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
          build_validation_options(method, html_options.merge(name: options[:name]), html_options)
          html_options.delete(:validate)
          super
        end

        private

        def error_field(form_helper, tag, id)
          form_helper.instance_exec form_helper.content_tag(tag, nil, id: id),
                                    Struct.new(:error_message, :tag_id).new([], ''),
                                    &form_helper.class.field_error_proc
        end

        def build_validation_options(method, options = {}, target_options = options)
          return unless @options[:validate]

          index       = @default_options[:index].present? ? "[#{@default_options[:index]}]" : ''
          child_index = @options[:child_index] ? "(\\d+|#{Regexp.escape(@options[:child_index].to_s)})" : '\\d+'

          name = options[:name] || "#{@object_name}#{index}[#{method}]"
          name = name.to_s.gsub(/_attributes\]\[#{child_index}\]/, '_attributes][]')
          name << '[]' if options[:multiple]

          @options[:validators][@object][method] = { name: name, options: options[:validate] }

          inject_stimulus_target(method, target_options)
        end

        def inject_stimulus_target(method, options)
          return unless should_inject_target?(method, options)

          method_name = method.to_s
          key_base = ClientSideValidations::Config.stimulus_controller_name.tr('-', '_')
          data = options[:data] ||= {}
          target_name = method_name.end_with?('_confirmation') ? 'confirmation' : 'input'

          append_target(data, :"#{key_base}_target", target_name)
          return unless target_name == 'confirmation'

          data[:"#{key_base}_confirms"] ||= "#{@object_name}_#{method_name.delete_suffix('_confirmation')}"
        end

        def should_inject_target?(method, options)
          return false if @object.nil?
          return false if options[:validate] == false

          method_has_validation?(method, options)
        end

        def append_target(data, key, value)
          existing = data[key].to_s.split(/\s+/).reject(&:empty?)
          data[key] = (existing + [value]).uniq.join(' ')
        end

        def method_has_validation?(method, options)
          return true if options[:validate].is_a?(Hash)
          return false unless @object.respond_to?(:client_side_validation_hash)
          return false unless @object.respond_to?(:_validators)

          sym = method.to_sym
          @object._validators[sym].present? || association_has_validation?(sym)
        end

        def association_has_validation?(sym)
          name = sym.to_s
          assoc =
            if name.end_with?('_id')
              name.delete_suffix('_id').to_sym
            elsif name.end_with?('_ids')
              name.delete_suffix('_ids').pluralize.to_sym
            end

          assoc && @object._validators[assoc].present?
        end
      end
    end
  end
end

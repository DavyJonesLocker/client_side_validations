module ClientSideValidations::ActionView::Helpers
  module FormHelper
    class Error < StandardError; end

    def form_for(record, *args, &block)
      options = args.extract_options!
      if options[:validate]

        # Always turn off HTML5 Validations
        options[:html] ||= {}
        options[:html][:novalidate] = 'novalidate'

        case record
        when String, Symbol
          raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is not supported with ClientSideValidations. Please use form_for(@resource, :as => :name) instead.'
        else
          object = record.is_a?(Array) ? record.last : record
        end
      end

      @validators = {}

      # Order matters here. Rails mutates the options object
      html_id = options[:html][:id] if options[:html]
      form   = super(record, *(args << options), &block)
      build_bound_validators(options)
      options[:id] = html_id if html_id
      script = client_side_form_settings(object, options)

      # Because of the load order requirement above this sub is necessary
      # Would be nice to not do this
      script = insert_validators_into_script(script)

      if assign_script_to_content_for(options[:validate], script)
        form.html_safe
      else
        "#{form}#{script}".html_safe
      end
    end

    def assign_script_to_content_for(name, script)
      if name && name != true
        content_for(name) { script.html_safe }
        true
      end
    end

    def apply_form_for_options!(object_or_array, options)
      super
      options[:html][:validate] = true if options[:validate]
    end

    def fields_for(record_or_name_or_array, record_object = nil, options = {}, &block)
      output = super
      build_bound_validators(options)
      output
    end

    private

    def build_bound_validators(options)
      if @validators
        options[:validators].each do |key, value|
          if @validators.key?(key)
            @validators[key].merge! value
          else
            @validators[key] = value
          end
        end
      end
    end

    def insert_validators_into_script(script)
      # There is probably a more performant way of doing this
      # But using String#sub has some issues. Undocumented "features"
      if script
        script = script.split(/"validator_hash"/)
        script = "#{script[0]}#{construct_validators.to_json}#{script[1]}"
      end

      script
    end

    def construct_validators
      @validators.inject({}) do |validator_hash, object_opts|
        option_hash = object_opts[1].inject({}) do |option_hash, attr|
          option_hash.merge!(attr[0] => attr[1][:options])
        end

        if object_opts[0].respond_to?(:client_side_validation_hash)
          validation_hash = object_opts[0].client_side_validation_hash(option_hash)
        else
          validation_hash = {}
        end

        option_hash.each_key do |attr|
          if validation_hash[attr]
            validator_hash.merge!(object_opts[1][attr][:name] => validation_hash[attr])
          end
        end

        validator_hash
      end
    end

    def client_side_form_settings(object, options)
      if options[:validate]
        builder = options[:parent_builder]

        if options[:id]
          var_name = options[:id]
        else
          if Rails.version >= '3.2.0'
            var_name = if object.respond_to?(:persisted?) && object.persisted?
              options[:as] ? "edit_#{options[:as]}" : [options[:namespace], dom_id(object, :edit)].compact.join("_")
            else
              options[:as] ? "new_#{options[:as]}" : [options[:namespace], dom_id(object)].compact.join("_")
            end
          else
            # This is to maintain backward compatibility with Rails 3.1
            # see: https://github.com/rails/rails/commit/e29773f885fd500189ffd964550ae20061d745ba#commitcomment-948052
            var_name = if object.respond_to?(:persisted?) && object.persisted?
              options[:as] ? "#{options[:as]}_edit" : dom_id(object, :edit)
            else
              options[:as] ? "#{options[:as]}_new" : dom_id(object)
            end
          end
        end

        if ClientSideValidations::Config.number_format_with_locale and defined?(I18n)
          number_format = I18n.t("number.format").slice(:separator, :delimiter)
        else
          number_format = {:separator=>".", :delimiter=>","}
        end
        patterns = {:numericality=>"/^(-|\\+)?(?:\\d+|\\d{1,3}(?:\\#{number_format[:delimiter]}\\d{3})+)(?:\\#{number_format[:separator]}\\d*)?$/"}


        content_tag(:script) do
          "//<![CDATA[\nif(window.ClientSideValidations===undefined)window.ClientSideValidations={};window.ClientSideValidations.disabled_validators=#{ClientSideValidations::Config.disabled_validators.to_json};window.ClientSideValidations.number_format=#{number_format.to_json};if(window.ClientSideValidations.patterns===undefined)window.ClientSideValidations.patterns = {};window.ClientSideValidations.patterns.numericality=#{patterns[:numericality]};#{"if(window.ClientSideValidations.remote_validators_prefix===undefined)window.ClientSideValidations.remote_validators_prefix='#{(ClientSideValidations::Config.root_path).sub(/\/+\Z/,'')}';" if ClientSideValidations::Config.root_path.present? }if(window.ClientSideValidations.forms===undefined)window.ClientSideValidations.forms={};window.ClientSideValidations.forms['#{var_name}'] = #{builder.client_side_form_settings(options, self).merge(:validators => 'validator_hash').to_json};\n//]]>".html_safe
        end
      end
    end

  end
end


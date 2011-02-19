module ClientSideValidations::ActionView::Helpers
  module FormHelper
    class Error < StandardError; end

    def form_for(record_or_name_or_array, *args, &proc)
      options = args.extract_options!
      options, csv_rules = extract_csv_rules_and_options(record_or_name_or_array, options)

      super(record_or_name_or_array, *(args << options), &proc).safe_concat(csv_rules)
    end

    def apply_form_for_options!(object_or_array, options)
      super
      options[:html][:validations] = options.delete(:validations) if options.key?(:validations)
    end

    private
      def extract_csv_rules_and_options(record_or_name_or_array, options)
        csv_rules = ""

        if options[:validations]
          case record_or_name_or_array
          when String, Symbol
            raise ClientSideValidations::ActionView::Helpers::FormHelper::Error, 'Using form_for(:name, @resource) is deprecated in Rails and is not supported with ClientSideValidations. Please use form_for(@resource, :as => :name) instead.'
          when Array
            object = record_or_name_or_array.last
          else
            object = record_or_name_or_array
          end

          if object.respond_to?(:persisted?) && object.persisted?
            options[:validations] = options[:as] ? "#{options[:as]}" : dom_id(object)
          else
            options[:validations] = options[:as] ? "#{options[:as]}_new" : dom_id(object, :new)
          end

          csv_rules = "var #{options[:validations]}ValidationRules=#{object.client_side_validation_hash.to_json}"
          csv_rules = content_tag(:script, csv_rules.html_safe, :type => "text/javascript")
        end

        [options, csv_rules]
      end
  end
end

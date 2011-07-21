module ClientSideValidations
  module Formtastic
    module FormBuilder

      def self.included(base)
        base.class_eval do
          def self.client_side_form_settings(options, form_helper)
            {
              :type => 'Formtastic::FormBuilder',
              :inline_error_class => self.default_inline_error_class
            }
          end
        end
      end

    end
  end
end

formtastic_builder = defined?(::Formtastic::FormBuilder) ? ::Formtastic::FormBuilder : ::Formtastic::SemanticFormBuilder
formtastic_builder.send(:include, ClientSideValidations::Formtastic::FormBuilder)


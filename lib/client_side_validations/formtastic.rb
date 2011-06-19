module ClientSideValidations
  module Formtastic
    module FormBuilder

      def self.included(base)
        base.class_eval do
          def self.client_side_form_settings(options, form_helper)
            {
              :type => self.to_s,
              :inline_error_class => ::Formtastic::FormBuilder.default_inline_error_class
            }
          end
        end
      end

    end
  end
end

Formtastic::FormBuilder.send(:include, ClientSideValidations::Formtastic::FormBuilder)


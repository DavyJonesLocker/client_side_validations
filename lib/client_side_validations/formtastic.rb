module ClientSideValidations
  module Formtastic
    module SemanticFormBuilder

      def self.included(base)
        base.class_eval do
          def self.client_side_form_settings(options, form_helper)
            {
              :type => self.to_s,
              :inline_error_class => ::Formtastic::SemanticFormBuilder.default_inline_error_class
            }
          end
        end
      end

    end
  end
end

Formtastic::SemanticFormBuilder.send(:include, ClientSideValidations::Formtastic::SemanticFormBuilder)


module ClientSideValidations
  module SimpleForm
    module FormBuilder

      def self.included(base)
        base.class_eval do
          def self.client_side_form_settings(options, form_helper)
            {
              :type => self.to_s,
              :error_class => ::SimpleForm.error_class,
              :error_tag => ::SimpleForm.error_tag,
              :wrapper_error_class => ::SimpleForm.wrapper_error_class,
              :wrapper_tag => ::SimpleForm.wrapper_tag
            }
          end
        end
      end

    end
  end
end

SimpleForm::FormBuilder.send(:include, ClientSideValidations::SimpleForm::FormBuilder)


module ClientSideValidations::ActionView::Helpers
  module FormTagHelper
    private
      def html_options_for_form(url_for_options, options, *parameters_for_url)
        options.stringify_keys!
        html_options = {}
        html_options['data-csv'] = options.delete('validations') if options.key?('validations')
        html_options.merge!(super(url_for_options, options, *parameters_for_url))
      end
  end
end

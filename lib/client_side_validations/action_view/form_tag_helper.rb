module ClientSideValidations
  module ActionView
    module Helpers
      module FormTagHelper
        private

        def html_options_for_form(url_for_options, options)
          options.stringify_keys!
          html_options = {}
          html_options['data-validate'] = options.delete('validate') if options['validate']
          html_options.merge!(super(url_for_options, options))
        end
      end
    end
  end
end

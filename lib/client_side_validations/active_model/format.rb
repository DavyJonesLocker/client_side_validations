# frozen_string_literal: true

module ClientSideValidations
  module ActiveModel
    module Format
      def client_side_hash(model, attribute, force = nil)
        options = self.options.dup
        if options[:with].respond_to?(:call)
          return unless force

          options[:with] = resolve_proc(options[:with], model)
          build_client_side_hash(model, attribute, options)
        elsif options[:without].respond_to?(:call)
          return unless force

          options[:without] = resolve_proc(options[:without], model)
          build_client_side_hash(model, attribute, options)
        else
          super
        end
      end

      private

      def message_type
        :invalid
      end
    end
  end
end

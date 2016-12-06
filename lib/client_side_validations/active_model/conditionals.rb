module ClientSideValidations
  module ActiveModel
    module Conditionals
      private

      def run_conditionals(conditionals)
        Array.wrap(conditionals).inject(true) do |acc, conditional|
          acc && run_one_conditional(conditional)
        end
      end

      def run_one_conditional(conditional)
        case conditional
        when ::Proc
          case conditional.arity
          when 0
            instance_exec(&conditional)
          when 1
            instance_exec(self, &conditional)
          else
            raise ArgumentError, 'Missing argument'
          end
        when String
          # rubocop:disable Lint/Eval'
          l = eval "lambda { |value| #{conditional} }"
          # rubocop:enable Lint/Eval'
          instance_exec(nil, &l)
        when Symbol
          send conditional
        else
          raise ArgumentError, "Unknown conditional #{conditional}. If supported by ActiveModel/ActiveRecord open a bug for client_side_validations gem."
        end
      end
    end
  end
end

# frozen_string_literal: true

module ClientSideValidations
  module ActiveModel
    module Conditionals
      private

      def run_conditionals(conditionals, conditional_type)
        Array.wrap(conditionals).all? do |conditional|
          value = run_one_conditional(conditional)
          if conditional_type == :unless
            !value
          else
            value
          end
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
          # rubocop:disable Security/Eval'
          l = eval("lambda { |value| #{conditional} }", binding, __FILE__, __LINE__)
          # rubocop:enable Security/Eval'
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

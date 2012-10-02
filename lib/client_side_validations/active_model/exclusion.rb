module ClientSideValidations::ActiveModel
  module Exclusion

    def client_side_hash(model, attribute, force = nil)
      if options[:in].respond_to?(:call)
        if force
          options = self.options.dup
          options[:in] = options[:in].call(model)
          hash = build_client_side_hash(model, attribute, options)
        else
          return
        end
      else
        hash = build_client_side_hash(model, attribute, self.options.dup)
      end

      if hash[:in].is_a?(Range)
        hash[:range] = hash[:in]
        hash.delete(:in)
      end

      hash
    end

  end
end


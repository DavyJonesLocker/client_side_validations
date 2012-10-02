module ClientSideValidations::ActiveModel
  module Format
    def client_side_hash(model, attribute, force = nil)
      options = self.options.dup
      if options[:with].respond_to?(:call)
        if force
          options[:with] = options[:with].call(model)
          build_client_side_hash(model, attribute, options)
        else
          return
        end
      elsif options[:without].respond_to?(:call)
        if force
          options[:without] = options[:without].call(model)
          build_client_side_hash(model, attribute, options)
        else
          return
        end
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


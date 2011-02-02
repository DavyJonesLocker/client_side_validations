module ClientSideValidations::ActiveModel
  module Format
    # def client_side_hash
      # hash = super
      # merge_options = {:with => options[:with], :without => options[:without]}
      # merge_options.delete_if { |key, value| value.nil? }
      # hash[kind][message_types.first].merge!(merge_options)
      # hash
    # end

    private

    def message_types
      [:invalid]
    end
  end
end


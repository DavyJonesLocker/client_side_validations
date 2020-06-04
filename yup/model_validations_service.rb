#
# This module uses `client_side_validations` gem to extract
# model validations, so we have the same goals and restrictions
# that they have: https://github.com/DavyJonesLocker/client_side_validations
#
module ModelValidationsService

  def self.get_validations(model_name)
    model_class = Object.const_get(model_name)
    validation_hash = model_class.new.client_side_validation_hash

    validation_hash.map do |attr_name, validators|
      {
        attribute: attr_name.to_s.camelize(:lower),
        validators: validators.map do |name, options|
          {
            name: name,
            options: options
          }
        end
      }
    end
  end
end

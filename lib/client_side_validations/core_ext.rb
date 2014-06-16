require 'active_support/json'

unless Rails.version >= "4.0"
  require 'client_side_validations/core_ext/range'
  require 'client_side_validations/core_ext/regexp'
end

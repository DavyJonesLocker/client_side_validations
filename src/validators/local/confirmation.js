import $ from 'jquery'

export const confirmationLocalValidator = function (element, options) {
  let value = element.val()
  let confirmationValue = $('#' + (element.attr('id')) + '_confirmation').val()

  if (!options.case_sensitive) {
    value = value.toLowerCase()
    confirmationValue = confirmationValue.toLowerCase()
  }

  if (value !== confirmationValue) {
    return options.message
  }
}

export default {
  confirmationLocalValidator
}

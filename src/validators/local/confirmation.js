import jQuery from 'jquery'

export const confirmationLocalValidator = ($element, options) => {
  let value = $element.val()
  let confirmationValue = jQuery(`#${$element.attr('id')}_confirmation`).val()

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

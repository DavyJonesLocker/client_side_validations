import { arrayHasValue } from '../../helpers.js'

const DEFAULT_ACCEPT_OPTION = ['1', true]

const isTextAccepted = (value, acceptOption) => {
  if (!acceptOption) {
    acceptOption = DEFAULT_ACCEPT_OPTION
  }

  if (Array.isArray(acceptOption)) {
    return arrayHasValue(value, acceptOption)
  }

  return value === acceptOption
}

export const acceptanceLocalValidator = ($element, options) => {
  let valid = true

  if ($element.attr('type') === 'checkbox') {
    valid = $element.prop('checked')
  }

  if ($element.attr('type') === 'text') {
    valid = isTextAccepted($element.val(), options.accept)
  }

  if (!valid) {
    return options.message
  }
}

export default {
  acceptanceLocalValidator
}

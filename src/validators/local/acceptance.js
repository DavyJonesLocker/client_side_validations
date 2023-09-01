import { arrayHasValue } from '../../helpers'

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
  const element = $element[0]
  let valid = true

  if (element.type === 'checkbox') {
    valid = element.checked
  }

  if (element.type === 'text') {
    valid = isTextAccepted(element.value, options.accept)
  }

  if (!valid) {
    return options.message
  }
}

export default {
  acceptanceLocalValidator
}

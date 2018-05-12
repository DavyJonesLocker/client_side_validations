import ClientSideValidations from '../../ClientSideValidations'

const LENGTH_CHECKS = {
  is: (a, b) => {
    return (a === b)
  },
  minimum: (a, b) => {
    return (a >= b)
  },
  maximum: (a, b) => {
    return (a <= b)
  }
}

export const lengthLocalValidator = function (element, options) {
  const length = element.val().length
  const blankOptions = {}
  blankOptions.message = options.is ? options.messages.is : options.minimum ? options.messages.minimum : void 0

  const elementIsNotPresent = ClientSideValidations.validators.local.presence(element, blankOptions)

  if (elementIsNotPresent) {
    if (options.allow_blank === true) {
      return
    }

    return elementIsNotPresent
  }

  for (const check in LENGTH_CHECKS) {
    if (!options[check]) {
      continue
    }

    if (!LENGTH_CHECKS[check](length, parseInt(options[check]))) {
      return options.messages[check]
    }
  }
}

export default {
  lengthLocalValidator
}

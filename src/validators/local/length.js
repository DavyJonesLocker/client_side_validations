import { isValuePresent } from '../../helpers'

const VALIDATIONS = {
  is: (a, b) => {
    return (a === parseInt(b, 10))
  },
  minimum: (a, b) => {
    return (a >= parseInt(b, 10))
  },
  maximum: (a, b) => {
    return (a <= parseInt(b, 10))
  }
}

const runValidations = (valueLength, options) => {
  for (const validation in VALIDATIONS) {
    const validationOption = options[validation]
    const validationFunction = VALIDATIONS[validation]

    if (validationOption && !validationFunction(valueLength, validationOption)) {
      return options.messages[validation]
    }
  }
}

export const lengthLocalValidator = ($element, options) => {
  const element = $element[0]
  const value = element.value

  if (options.allow_blank && !isValuePresent(value)) {
    return
  }

  return runValidations(value.length, options)
}

export default {
  lengthLocalValidator
}

import jQuery from 'jquery'
import ClientSideValidations from '../../ClientSideValidations'
import { isValuePresent } from '../../helpers.js'

const VALIDATIONS = {
  even: (a) => {
    return parseInt(a, 10) % 2 === 0
  },
  greater_than: (a, b) => {
    return parseFloat(a) > parseFloat(b)
  },
  greater_than_or_equal_to: (a, b) => {
    return parseFloat(a) >= parseFloat(b)
  },
  equal_to: (a, b) => {
    return parseFloat(a) === parseFloat(b)
  },
  less_than: (a, b) => {
    return parseFloat(a) < parseFloat(b)
  },
  less_than_or_equal_to: (a, b) => {
    return parseFloat(a) <= parseFloat(b)
  },
  odd: (a) => {
    return parseInt(a, 10) % 2 === 1
  },
  other_than: (a, b) => {
    return parseFloat(a) !== parseFloat(b)
  }
}

const getOtherValue = (validationOption, $form) => {
  if (!isNaN(parseFloat(validationOption))) {
    return validationOption
  }

  const validationElement = $form.find(`[name*="${validationOption}"]`)

  if (validationElement.length === 1) {
    const numberFormat = $form[0].ClientSideValidations.settings.number_format
    const otherFormattedValue = jQuery.trim(validationElement.val()).replace(new RegExp(`\\${numberFormat.separator}`, 'g'), '.')

    if (!isNaN(parseFloat(otherFormattedValue))) {
      return otherFormattedValue
    }
  }
}

const isValid = (validationFunction, validationOption, formattedValue, $form) => {
  if (validationFunction.length === 2) {
    const otherValue = getOtherValue(validationOption, $form)
    return (otherValue == null || otherValue === '') || validationFunction(formattedValue, otherValue)
  } else {
    return validationFunction(formattedValue)
  }
}

const runFunctionValidations = (formattedValue, $form, options) => {
  for (const validation in VALIDATIONS) {
    const validationOption = options[validation]
    const validationFunction = VALIDATIONS[validation]

    // Must check for null because this could be 0
    if (validationOption == null) {
      continue
    }

    if (!isValid(validationFunction, validationOption, formattedValue, $form)) {
      return options.messages[validation]
    }
  }
}

const runValidations = (formattedValue, $form, options) => {
  if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(formattedValue)) {
    return options.messages.only_integer
  }

  if (!ClientSideValidations.patterns.numericality.default.test(formattedValue)) {
    return options.messages.numericality
  }

  return runFunctionValidations(formattedValue, $form, options)
}

export const numericalityLocalValidator = ($element, options) => {
  const value = $element.val()

  if (options.allow_blank && !isValuePresent(value)) {
    return
  }

  const $form = jQuery($element[0].form)
  const numberFormat = $form[0].ClientSideValidations.settings.number_format
  const formattedValue = jQuery.trim(value).replace(new RegExp(`\\${numberFormat.separator}`, 'g'), '.')

  return runValidations(formattedValue, $form, options)
}

export default {
  numericalityLocalValidator
}

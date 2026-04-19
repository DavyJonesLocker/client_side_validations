import ClientSideValidations from './core'
import { dispatchCustomEvent } from './events'
import { getDOMElements, isFormElement, isInputElement, isVisible } from './utils'

import { absenceLocalValidator, presenceLocalValidator } from './validators/local/absence_presence'
import { acceptanceLocalValidator } from './validators/local/acceptance'
import { formatLocalValidator } from './validators/local/format'
import { numericalityLocalValidator } from './validators/local/numericality'
import { lengthLocalValidator } from './validators/local/length'
import { exclusionLocalValidator, inclusionLocalValidator } from './validators/local/exclusion_inclusion'
import { confirmationLocalValidator } from './validators/local/confirmation'
import { uniquenessLocalValidator } from './validators/local/uniqueness'

// Validators will run in the following order
ClientSideValidations.validators.local = {
  absence: absenceLocalValidator,
  presence: presenceLocalValidator,
  acceptance: acceptanceLocalValidator,
  format: formatLocalValidator,
  numericality: numericalityLocalValidator,
  length: lengthLocalValidator,
  inclusion: inclusionLocalValidator,
  exclusion: exclusionLocalValidator,
  confirmation: confirmationLocalValidator,
  uniqueness: uniquenessLocalValidator
}

ClientSideValidations.enable = (target) => {
  getDOMElements(target).forEach((element) => {
    if (isFormElement(element)) {
      ClientSideValidations.enablers.form(element)
    } else if (isInputElement(element)) {
      ClientSideValidations.enablers.input(element)
    }
  })

  return target
}

ClientSideValidations.validate = (target) => {
  getDOMElements(target).forEach((element) => {
    if (isFormElement(element)) {
      ClientSideValidations.enable(element)
    }
  })

  return target
}

ClientSideValidations.isValid = (target, validators) => {
  const element = getDOMElements(target)[0]

  if (!element) {
    return true
  }

  if (!validators) {
    const form = isFormElement(element) ? element : element.form
    validators = form?.ClientSideValidations?.settings?.validators
  }

  if (isFormElement(element)) {
    return validateForm(element, validators || {})
  }

  return validateElement(element, validatorsFor(element.name, validators || {}))
}

const cleanNestedElementName = (elementName, nestedMatches, validators) => {
  for (const validatorName in validators) {
    if (validatorName.match(`\\[${nestedMatches[1]}\\].*\\[\\]\\[${nestedMatches[2]}\\]$`)) {
      elementName = elementName.replace(/\[[\da-z_]+\]\[(\w+)\]$/g, '[][$1]')
    }
  }

  return elementName
}

const cleanElementName = (elementName, validators) => {
  elementName = elementName.replace(/\[(\w+_attributes)\]\[[\da-z_]+\](?=\[(?:\w+_attributes)\])/g, '[$1][]')

  const nestedMatches = elementName.match(/\[(\w+_attributes)\].*\[(\w+)\]$/)

  if (nestedMatches) {
    elementName = cleanNestedElementName(elementName, nestedMatches, validators)
  }

  return elementName
}

const validatorsFor = (elementName, validators) => {
  if (!elementName || !validators) {
    return {}
  }

  if (Object.prototype.hasOwnProperty.call(validators, elementName)) {
    return validators[elementName]
  }

  return validators[cleanElementName(elementName, validators)] || {}
}

const getValidationInputs = (form) => {
  return Array.from(form.elements).filter((element) => {
    if (element.dataset.csvValidate == null || element.disabled) {
      return false
    }

    return isVisible(element)
  })
}

const validateForm = (form, validators) => {
  let valid = true

  dispatchCustomEvent(form, 'form:validate:before')

  getValidationInputs(form).forEach((element) => {
    if (!validateElement(element, validatorsFor(element.name, validators))) {
      valid = false
    }
  })

  if (valid) {
    dispatchCustomEvent(form, 'form:validate:pass')
  } else {
    dispatchCustomEvent(form, 'form:validate:fail')
  }

  dispatchCustomEvent(form, 'form:validate:after')

  return valid
}

const passElement = (element) => {
  dispatchCustomEvent(element, 'element:validate:pass')
  delete element.dataset.csvValid
}

const failElement = (element, message) => {
  dispatchCustomEvent(element, 'element:validate:fail', message)
  element.dataset.csvValid = 'false'
}

const afterValidate = (element) => {
  dispatchCustomEvent(element, 'element:validate:after')
  return element.dataset.csvValid !== 'false'
}

const executeValidator = (validatorFunctions, validatorFunction, validatorOptions, element) => {
  for (const validatorOption in validatorOptions) {
    if (!validatorOptions[validatorOption]) {
      continue
    }

    const message = validatorFunction.call(validatorFunctions, element, validatorOptions[validatorOption])

    if (message) {
      failElement(element, message)
      return false
    }
  }

  return true
}

const executeValidators = (validatorFunctions, element, validators) => {
  for (const validator in validators) {
    if (!validatorFunctions[validator]) {
      continue
    }

    if (!executeValidator(validatorFunctions, validatorFunctions[validator], validators[validator], element)) {
      return false
    }
  }

  return true
}

const isMarkedForDestroy = (element) => {
  const elementName = element.name
  const form = element.form

  if (form && /\[([^\]]*?)\]$/.test(elementName)) {
    const destroyInputName = elementName.replace(/\[([^\]]*?)\]$/, '[_destroy]')
    const destroyInputElement = form.querySelector(`input[name="${destroyInputName}"]`)

    if (destroyInputElement && destroyInputElement.value === '1') {
      return true
    }
  }

  return false
}

const executeAllValidators = (element, validators) => {
  if (element.dataset.csvChanged === 'false' || element.disabled) {
    return
  }

  element.dataset.csvChanged = 'false'

  if (executeValidators(ClientSideValidations.validators.all(), element, validators)) {
    passElement(element)
  }
}

const validateElement = (element, validators) => {
  dispatchCustomEvent(element, 'element:validate:before')

  if (isMarkedForDestroy(element)) {
    passElement(element)
  } else {
    executeAllValidators(element, validators)
  }

  return afterValidate(element)
}

if (!window.ClientSideValidations) {
  window.ClientSideValidations = ClientSideValidations

  if (!isAMD() && !isCommonJS()) {
    ClientSideValidations.start()
  }
}

function isAMD () {
  return typeof define === 'function' && define.amd // eslint-disable-line no-undef
}

function isCommonJS () {
  return typeof exports === 'object' && typeof module !== 'undefined'
}

export default ClientSideValidations

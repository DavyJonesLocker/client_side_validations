import jQuery from 'jquery'
import ClientSideValidations from './core'

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

jQuery.fn.disableClientSideValidations = function () {
  ClientSideValidations.disable(this)

  return this
}

jQuery.fn.enableClientSideValidations = function () {
  const selectors = { forms: 'form', inputs: 'input' }

  for (const selector in selectors) {
    const enablers = selectors[selector]

    this.filter(ClientSideValidations.selectors[selector]).each(function () {
      ClientSideValidations.enablers[enablers](this)
    })
  }

  return this
}

jQuery.fn.resetClientSideValidations = function () {
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    ClientSideValidations.reset(this)
  })

  return this
}

jQuery.fn.validate = function () {
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    jQuery(this).enableClientSideValidations()
  })

  return this
}

jQuery.fn.isValid = function (validators) {
  const obj = jQuery(this[0])

  if (obj.is('form')) {
    return validateForm(obj, validators)
  } else {
    return validateElement(obj, validatorsFor(this[0].name, validators))
  }
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
  if (Object.prototype.hasOwnProperty.call(validators, elementName)) {
    return validators[elementName]
  }

  return validators[cleanElementName(elementName, validators)] || {}
}

const validateForm = ($form, validators) => {
  let valid = true

  $form.trigger('form:validate:before.ClientSideValidations')

  $form.find(ClientSideValidations.selectors.validate_inputs).each(function () {
    if (!jQuery(this).isValid(validators)) {
      valid = false
    }

    return true
  })

  if (valid) {
    $form.trigger('form:validate:pass.ClientSideValidations')
  } else {
    $form.trigger('form:validate:fail.ClientSideValidations')
  }

  $form.trigger('form:validate:after.ClientSideValidations')

  return valid
}

const passElement = ($element) => {
  const element = $element[0]
  $element.trigger('element:validate:pass.ClientSideValidations')
  delete element.dataset.csvValid
}

const failElement = ($element, message) => {
  const element = $element[0]
  $element.trigger('element:validate:fail.ClientSideValidations', message)
  element.dataset.csvValid = 'false'
}

const afterValidate = ($element) => {
  const element = $element[0]
  $element.trigger('element:validate:after.ClientSideValidations')
  return element.dataset.csvValid !== 'false'
}

const executeValidator = (validatorFunctions, validatorFunction, validatorOptions, $element) => {
  for (const validatorOption in validatorOptions) {
    if (!validatorOptions[validatorOption]) {
      continue
    }

    const message = validatorFunction.call(validatorFunctions, $element, validatorOptions[validatorOption])

    if (message) {
      failElement($element, message)
      return false
    }
  }

  return true
}

const executeValidators = (validatorFunctions, $element, validators) => {
  for (const validator in validators) {
    if (!validatorFunctions[validator]) {
      continue
    }

    if (!executeValidator(validatorFunctions, validatorFunctions[validator], validators[validator], $element)) {
      return false
    }
  }

  return true
}

const isMarkedForDestroy = ($element) => {
  const element = $element[0]
  const elementName = element.name

  if (/\[([^\]]*?)\]$/.test(elementName)) {
    const destroyInputName = elementName.replace(/\[([^\]]*?)\]$/, '[_destroy]')
    const destroyInputElement = document.querySelector(`input[name="${destroyInputName}"]`)

    if (destroyInputElement && destroyInputElement.value === '1') {
      return true
    }
  }

  return false
}

const executeAllValidators = ($element, validators) => {
  const element = $element[0]
  if (element.dataset.csvChanged === 'false' || element.disabled) {
    return
  }

  element.dataset.csvChanged = 'false'

  if (executeValidators(ClientSideValidations.validators.all(), $element, validators)) {
    passElement($element)
  }
}

const validateElement = ($element, validators) => {
  $element.trigger('element:validate:before.ClientSideValidations')

  if (isMarkedForDestroy($element)) {
    passElement($element)
  } else {
    executeAllValidators($element, validators)
  }

  return afterValidate($element)
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

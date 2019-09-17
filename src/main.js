import $ from 'jquery'
import ClientSideValidations from './ClientSideValidations'

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

$.fn.disableClientSideValidations = function () {
  ClientSideValidations.disable(this)

  return this
}

$.fn.enableClientSideValidations = function () {
  const selectors = { forms: 'form', inputs: 'input' }

  for (var selector in selectors) {
    const enablers = selectors[selector]

    this.filter(ClientSideValidations.selectors[selector]).each(function () {
      return ClientSideValidations.enablers[enablers](this)
    })
  }

  return this
}

$.fn.resetClientSideValidations = function () {
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    return ClientSideValidations.reset(this)
  })

  return this
}

$.fn.validate = function () {
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    return $(this).enableClientSideValidations()
  })

  return this
}

$.fn.isValid = function (validators) {
  const obj = $(this[0])

  if (obj.is('form')) {
    return validateForm(obj, validators)
  } else {
    return validateElement(obj, validatorsFor(this[0].name, validators))
  }
}

const cleanNestedElementName = (elementName, nestedMatches, validators) => {
  for (const validatorName in validators) {
    if (validatorName.match('\\[' + nestedMatches[1] + '\\].*\\[\\]\\[' + nestedMatches[2] + '\\]$')) {
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
  if (Object.prototype.isPrototypeOf.call(validators, elementName)) {
    return validators[elementName]
  }

  return validators[cleanElementName(elementName, validators)] || {}
}

const validateForm = (form, validators) => {
  let valid = true

  form.trigger('form:validate:before.ClientSideValidations')

  form.find(ClientSideValidations.selectors.validate_inputs).each(function () {
    if (!$(this).isValid(validators)) {
      valid = false
    }

    return true
  })

  if (valid) {
    form.trigger('form:validate:pass.ClientSideValidations')
  } else {
    form.trigger('form:validate:fail.ClientSideValidations')
  }

  form.trigger('form:validate:after.ClientSideValidations')

  return valid
}

const passElement = (element) => {
  element.trigger('element:validate:pass.ClientSideValidations').data('valid', null)
}

const failElement = (element, message) => {
  element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false)
}

const afterValidate = (element) => {
  return element.trigger('element:validate:after.ClientSideValidations').data('valid') !== false
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
    const validatorFunction = validatorFunctions[validator]

    if (!validatorFunction) {
      continue
    }

    if (!executeValidator(validatorFunctions, validatorFunction, validators[validator], element)) {
      return false
    }
  }

  return true
}

const isMarkedForDestroy = (element) => {
  if (element.attr('name').search(/\[([^\]]*?)\]$/) >= 0) {
    const destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]')

    if ($("input[name='" + destroyInputName + "']").val() === '1') {
      return true
    }
  }

  return false
}

const executeAllValidators = (element, validators) => {
  if (element.data('changed') !== false) {
    element.data('changed', false)

    if (executeValidators(ClientSideValidations.validators.local, element, validators) && executeValidators(ClientSideValidations.validators.remote, element, validators)) {
      passElement(element)
    }
  }
}

const validateElement = (element, validators) => {
  element.trigger('element:validate:before.ClientSideValidations')

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
  return typeof exports === 'object' && typeof module !== 'undefined' // eslint-disable-line no-undef
}

export default ClientSideValidations

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
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    return ClientSideValidations.enablers.form(this)
  })

  this.filter(ClientSideValidations.selectors.inputs).each(function () {
    return ClientSideValidations.enablers.input(this)
  })

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

const validatorsFor = (name, validators) => {
  if (Object.prototype.isPrototypeOf.call(validators, name)) {
    return validators[name]
  }
  name = name.replace(/\[(\w+_attributes)\]\[[\da-z_]+\](?=\[(?:\w+_attributes)\])/g, '[$1][]')

  const captures = name.match(/\[(\w+_attributes)\].*\[(\w+)\]$/)

  if (captures) {
    for (const validatorName in validators) {
      if (validatorName.match('\\[' + captures[1] + '\\].*\\[\\]\\[' + captures[2] + '\\]$')) {
        name = name.replace(/\[[\da-z_]+\]\[(\w+)\]$/g, '[][$1]')
      }
    }
  }

  return validators[name] || {}
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

const validateElement = (element, validators) => {
  element.trigger('element:validate:before.ClientSideValidations')

  const passElement = () => {
    return element.trigger('element:validate:pass.ClientSideValidations').data('valid', null)
  }

  const failElement = (message) => {
    element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false)
    return false
  }

  const afterValidate = () => {
    return element.trigger('element:validate:after.ClientSideValidations').data('valid') !== false
  }

  const executeValidators = (context) => {
    let valid = true

    for (const validator in validators) {
      const fn = context[validator]

      if (!fn) {
        continue
      }

      const ref = validators[validator]

      for (const i in ref) {
        const message = fn.call(context, element, ref[i])

        if (message) {
          valid = failElement(message)
          break
        }
      }

      if (!valid) {
        break
      }
    }

    return valid
  }

  if (element.attr('name').search(/\[([^\]]*?)\]$/) >= 0) {
    const destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]')
    if ($("input[name='" + destroyInputName + "']").val() === '1') {
      passElement()
      return afterValidate()
    }
  }

  if (element.data('changed') === false) {
    return afterValidate()
  }

  element.data('changed', false)

  if (executeValidators(ClientSideValidations.validators.local) && executeValidators(ClientSideValidations.validators.remote)) {
    passElement()
  }

  return afterValidate()
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

export default {
  ClientSideValidations
}

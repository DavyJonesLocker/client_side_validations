import ClientSideValidations from '../../ClientSideValidations'

export const formatLocalValidator = function (element, options) {
  const elementIsNotPresent = ClientSideValidations.validators.local.presence(element, options)

  if (elementIsNotPresent) {
    if (options.allow_blank === true) {
      return
    }

    return elementIsNotPresent
  }

  if (options.with && !new RegExp(options.with.source, options.with.options).test(element.val())) {
    return options.message
  }

  if (options.without && new RegExp(options.without.source, options.without.options).test(element.val())) {
    return options.message
  }
}

export default {
  formatLocalValidator
}

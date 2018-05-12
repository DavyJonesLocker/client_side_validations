import ClientSideValidations from '../../ClientSideValidations'

const inclusionValidator = function (element, options, inclusion) {
  const elementIsNotPresent = ClientSideValidations.validators.local.presence(element, options)

  if (elementIsNotPresent) {
    if (options.allow_blank === true) {
      return
    }

    return elementIsNotPresent
  }

  if (options.in) {
    const results = []

    for (const i in options.in) {
      results.push(options.in[i].toString())
    }

    if ((results.indexOf(element.val()) >= 0) === !inclusion) {
      return options.message
    }
  }

  if (options.range) {
    const lower = options.range[0]
    const upper = options.range[1]

    if ((element.val() >= lower && element.val() <= upper) === !inclusion) {
      return options.message
    }
  }
}

export const exclusionLocalValidator = function (element, options) {
  return inclusionValidator(element, options, false)
}

export const inclusionLocalValidator = function (element, options) {
  return inclusionValidator(element, options, true)
}

export default {
  exclusionLocalValidator,
  inclusionLocalValidator
}

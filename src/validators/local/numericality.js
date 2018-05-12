import $ from 'jquery'
import ClientSideValidations from '../../ClientSideValidations'

const NUMERICALITY_CHECKS = {
  greater_than: (a, b) => {
    return (a > b)
  },
  greater_than_or_equal_to: (a, b) => {
    return (a >= b)
  },
  equal_to: (a, b) => {
    return (a === b)
  },
  less_than: (a, b) => {
    return (a < b)
  },
  less_than_or_equal_to: (a, b) => {
    return (a <= b)
  }
}

export const numericalityLocalValidator = function (element, options) {
  if (options.allow_blank === true && ClientSideValidations.validators.local.presence(element, {
    message: options.messages.numericality
  })) {
    return
  }

  const $form = $(element[0].form)
  const numberFormat = $form[0].ClientSideValidations.settings.number_format
  const val = $.trim(element.val()).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.')

  if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(val)) {
    return options.messages.only_integer
  }

  if (!ClientSideValidations.patterns.numericality.default.test(val)) {
    return options.messages.numericality
  }

  for (const check in NUMERICALITY_CHECKS) {
    if (options[check] == null) {
      continue
    }

    const checkValue = !isNaN(parseFloat(options[check])) && isFinite(options[check]) ? options[check] : $form.find('[name*=' + options[check] + ']').length === 1 ? $form.find('[name*=' + options[check] + ']').val() : void 0

    if ((checkValue == null) || checkValue === '') {
      return
    }

    if (!NUMERICALITY_CHECKS[check](parseFloat(val), parseFloat(checkValue))) {
      return options.messages[check]
    }
  }

  if (options.odd && !(parseInt(val, 10) % 2)) {
    return options.messages.odd
  }

  if (options.even && (parseInt(val, 10) % 2)) {
    return options.messages.even
  }
}

export default {
  numericalityLocalValidator
}

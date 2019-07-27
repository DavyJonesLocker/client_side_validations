import { valueIsPresent } from '../../helpers.js'

export const absenceLocalValidator = (element, options) => {
  if (valueIsPresent(element.val())) {
    return options.message
  }
}

export const presenceLocalValidator = (element, options) => {
  if (!valueIsPresent(element.val())) {
    return options.message
  }
}

export default {
  absenceLocalValidator,
  presenceLocalValidator
}

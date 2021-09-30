import { isValuePresent } from '../../helpers'

export const absenceLocalValidator = ($element, options) => {
  if (isValuePresent($element.val())) {
    return options.message
  }
}

export const presenceLocalValidator = ($element, options) => {
  if (!isValuePresent($element.val())) {
    return options.message
  }
}

export default {
  absenceLocalValidator,
  presenceLocalValidator
}

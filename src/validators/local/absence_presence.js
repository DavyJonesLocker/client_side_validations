import { isValuePresent } from '../../utils'

export const absenceLocalValidator = (element, options) => {
  if (isValuePresent(element.value)) {
    return options.message
  }
}

export const presenceLocalValidator = (element, options) => {
  if (!isValuePresent(element.value)) {
    return options.message
  }
}

export default {
  absenceLocalValidator,
  presenceLocalValidator
}

import { isValuePresent } from '../../utils'

export const absenceLocalValidator = ($element, options) => {
  const element = $element[0]

  if (isValuePresent(element.value)) {
    return options.message
  }
}

export const presenceLocalValidator = ($element, options) => {
  const element = $element[0]

  if (!isValuePresent(element.value)) {
    return options.message
  }
}

export default {
  absenceLocalValidator,
  presenceLocalValidator
}

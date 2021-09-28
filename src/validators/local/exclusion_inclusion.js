import { arrayHasValue, isValuePresent } from '../../helpers.js'

const isInList = (value, otherValues) => {
  const normalizedOtherValues = []

  for (const otherValueIndex in otherValues) {
    normalizedOtherValues.push(otherValues[otherValueIndex].toString())
  }

  return arrayHasValue(value, normalizedOtherValues)
}

const isInRange = (value, range) => {
  return value >= range[0] && value <= range[1]
}

const isIncluded = (value, options, allowBlank) => {
  if ((options.allow_blank && !isValuePresent(value)) === allowBlank) {
    return true
  }

  return (options.in && isInList(value, options.in)) || (options.range && isInRange(value, options.range))
}

export const exclusionLocalValidator = ($element, options) => {
  const value = $element.val()

  if (isIncluded(value, options, false) || (!options.allow_blank && !isValuePresent(value))) {
    return options.message
  }
}

export const inclusionLocalValidator = ($element, options) => {
  const value = $element.val()

  if (!isIncluded(value, options, true)) {
    return options.message
  }
}

export default {
  exclusionLocalValidator,
  inclusionLocalValidator
}

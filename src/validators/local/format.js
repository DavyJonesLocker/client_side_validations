import { isValuePresent } from '../../helpers'

const isMatching = (value, regExpOptions) => {
  return new RegExp(regExpOptions.source, regExpOptions.options).test(value)
}

const hasValidFormat = (value, withOptions, withoutOptions) => {
  return (withOptions && isMatching(value, withOptions)) || (withoutOptions && !isMatching(value, withoutOptions))
}

export const formatLocalValidator = ($element, options) => {
  const element = $element[0]
  const value = element.value

  if (options.allow_blank && !isValuePresent(value)) {
    return
  }

  if (!hasValidFormat(value, options.with, options.without)) {
    return options.message
  }
}

export default {
  formatLocalValidator
}

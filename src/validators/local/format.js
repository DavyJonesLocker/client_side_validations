import { isValuePresent } from '../../helpers.js'

const isMatching = (value, regExpOptions) => {
  return new RegExp(regExpOptions.source, regExpOptions.options).test(value)
}

const hasValidFormat = (value, withOptions, withoutOptions) => {
  return (withOptions && isMatching(value, withOptions)) || (withoutOptions && !isMatching(value, withoutOptions))
}

export const formatLocalValidator = (element, options) => {
  const value = element.val()

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

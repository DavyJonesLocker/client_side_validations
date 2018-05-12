const presenceValidator = function (element, options, presence) {
  if (/^\s*$/.test(element.val() || '') === !presence) {
    return options.message
  }
}

export const absenceLocalValidator = function (element, options) {
  return presenceValidator(element, options, true)
}

export const presenceLocalValidator = function (element, options) {
  return presenceValidator(element, options, false)
}

export default {
  absenceLocalValidator,
  presenceLocalValidator
}

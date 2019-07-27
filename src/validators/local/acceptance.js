export const acceptanceLocalValidator = (element, options) => {
  var valid = true

  if (element.attr('type') === 'checkbox') {
    valid = element.prop('checked')
  }

  if (element.attr('type') === 'text') {
    // TODO: fix this validator. It does not work with arrays
    const accept = options.accept || '1'
    valid = element.val() === accept.toString()
  }

  if (!valid) {
    return options.message
  }
}

export default {
  acceptanceLocalValidator
}

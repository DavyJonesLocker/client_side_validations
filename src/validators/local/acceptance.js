export const acceptanceLocalValidator = function (element, options) {
  switch (element.attr('type')) {
    case 'checkbox':
      if (!element.prop('checked')) {
        return options.message
      }
      break
    case 'text':
      const ref = options.accept
      if (element.val() !== ((ref != null ? ref.toString() : void 0) || '1')) {
        return options.message
      }
  }
}

export default {
  acceptanceLocalValidator
}

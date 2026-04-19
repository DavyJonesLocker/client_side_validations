export const confirmationLocalValidator = (element, options) => {
  let value = element.value
  let confirmationValue = document.getElementById(`${element.id}_confirmation`).value

  if (!options.case_sensitive) {
    value = value.toLowerCase()
    confirmationValue = confirmationValue.toLowerCase()
  }

  if (value !== confirmationValue) {
    return options.message
  }
}

export default {
  confirmationLocalValidator
}

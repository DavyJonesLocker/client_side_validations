const isLocallyUnique = (element, value, otherValue, caseSensitive) => {
  if (!caseSensitive) {
    value = value.toLowerCase()
    otherValue = otherValue.toLowerCase()
  }

  if (otherValue === value) {
    element.dataset.notLocallyUnique = true
    return false
  }

  if (element.dataset.notLocallyUnique) {
    delete element.dataset.notLocallyUnique
    element.dataset.changed = true
  }

  return true
}

export const uniquenessLocalValidator = ($element, options) => {
  const element = $element[0]
  const elementName = element.name
  const matches = elementName.match(/^(.+_attributes\])\[\d+\](.+)$/)

  if (!matches) {
    return
  }

  const form = element.form

  const value = element.value
  let valid = true

  const query = `[name^="${matches[1]}"][name$="${matches[2]}"]:not([name="${elementName}"])`
  const otherElements = form.querySelectorAll(query)

  Array.prototype.slice.call(otherElements).forEach(function (otherElement) {
    const otherValue = otherElement.value

    if (!isLocallyUnique(otherElement, value, otherValue, options.case_sensitive)) {
      valid = false
    }
  })

  if (!valid) {
    return options.message
  }
}

export default {
  uniquenessLocalValidator
}

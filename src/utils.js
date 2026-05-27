export const arrayHasValue = (value, otherValues) => {
  for (let i = 0, l = otherValues.length; i < l; i++) {
    if (value === otherValues[i]) {
      return true
    }
  }

  return false
}

export const createElementFromHTML = (html) => {
  const element = document.createElement('div')
  element.innerHTML = html

  return element.firstChild
}

const isDOMCollection = (target) => {
  return Array.isArray(target) ||
    (typeof NodeList !== 'undefined' && target instanceof NodeList) ||
    (typeof HTMLCollection !== 'undefined' && target instanceof HTMLCollection) ||
    (typeof RadioNodeList !== 'undefined' && target instanceof RadioNodeList)
}

const isDOMElement = (target) => {
  return target != null && target.nodeType === 1
}

export const getDOMElements = (target) => {
  if (target == null) {
    return []
  }

  if (isDOMElement(target)) {
    return [target]
  }

  if (isDOMCollection(target)) {
    return Array.from(target).filter(isDOMElement)
  }

  return []
}

export const isFormElement = (element) => {
  return element.tagName === 'FORM'
}

export const isInputElement = (element) => {
  switch (element.tagName) {
    case 'INPUT':
      return element.type !== 'submit' && element.type !== 'button'
    case 'SELECT':
    case 'TEXTAREA':
      return true
    default:
      return false
  }
}

const isVisible = (element) => {
  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
}

export const isValidatable = (element) => {
  return element.dataset.csvValidateHidden != null || isVisible(element)
}

export const isValuePresent = (value) => {
  return !/^\s*$/.test(value || '')
}

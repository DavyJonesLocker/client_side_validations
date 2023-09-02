export const addClass = (element, customClass) => {
  if (customClass) {
    element.classList.add(...customClass.split(' '))
  }
}

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

export const isValuePresent = (value) => {
  return !/^\s*$/.test(value || '')
}

export const removeClass = (element, customClass) => {
  if (customClass) {
    element.classList.remove(...customClass.split(' '))
  }
}

export default {
  addClass,
  arrayHasValue,
  createElementFromHTML,
  isValuePresent,
  removeClass
}

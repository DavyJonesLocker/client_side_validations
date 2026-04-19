const boundEventListeners = new WeakMap()

const addBoundEventListener = (element, eventName, listener) => {
  element.addEventListener(eventName, listener)

  const listeners = boundEventListeners.get(element) || []
  listeners.push({ eventName, listener })
  boundEventListeners.set(element, listeners)
}

export const bindElementEvents = (element, eventsToBind) => {
  for (const eventName in eventsToBind) {
    addBoundEventListener(element, eventName, eventsToBind[eventName])
  }
}

export const clearBoundEventListeners = (element) => {
  const listeners = boundEventListeners.get(element)

  if (!listeners) {
    return
  }

  listeners.forEach(({ eventName, listener }) => {
    element.removeEventListener(eventName, listener)
  })

  boundEventListeners.delete(element)
}

export const dispatchCustomEvent = (element, eventName, detail) => {
  element.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    detail
  }))
}

export default {
  bindElementEvents,
  clearBoundEventListeners,
  dispatchCustomEvent
}

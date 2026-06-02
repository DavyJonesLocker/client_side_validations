import { bindElementEvents, clearBoundEventListeners } from './events'
import { createElementFromHTML, getDOMElements, isFormElement, isInputElement, isVisible } from './utils'

const adapterBindings = new WeakMap()

const getElementAdapter = (element) => {
  return ClientSideValidations.adapters.find(element)
}

const isValidatableInputElement = (element) => {
  return isVisible(element) || getElementAdapter(element) != null
}

const clearAdapterBinding = (element) => {
  const unbind = adapterBindings.get(element)

  if (typeof unbind === 'function') {
    unbind()
  }

  adapterBindings.delete(element)
}

const bindAdapterInput = (element, form) => {
  const adapter = getElementAdapter(element)

  if (!adapter || typeof adapter.bind !== 'function') {
    return false
  }

  const unbind = adapter.bind(element, () => {
    element.dataset.csvChanged = 'true'
    ClientSideValidations.isValid(element, form.ClientSideValidations.settings.validators)
  })

  if (typeof unbind === 'function') {
    adapterBindings.set(element, unbind)
  }

  return true
}

const isNamedInputElement = (element) => {
  return isInputElement(element) && element.name != null && element.name !== ''
}

const getFormControls = (form) => {
  return Array.from(form.elements).filter(isInputElement)
}

const getFormInputs = (form) => {
  return getFormControls(form).filter((element) => {
    return isNamedInputElement(element) && !element.disabled && isValidatableInputElement(element)
  })
}

const findFormElementByName = (form, name) => {
  return getFormControls(form).find((element) => element.name === name)
}

const enableForm = (form) => {
  ClientSideValidations.enablers.form(form)
}

const enableForms = () => {
  document.querySelectorAll(ClientSideValidations.selectors.forms).forEach(enableForm)
}

const ClientSideValidations = {
  callbacks: {
    element: {
      after: (element, eventData) => {},
      before: (element, eventData) => {},
      fail: (element, message, addError, eventData) => addError(),
      pass: (element, removeError, eventData) => removeError()
    },
    form: {
      after: (form, eventData) => {},
      before: (form, eventData) => {},
      fail: (form, eventData) => {},
      pass: (form, eventData) => {}
    }
  },
  adapters: {
    items: [],
    register (adapter) {
      this.items.push(adapter)

      return adapter
    },
    find (element) {
      return this.items.find((adapter) => {
        return adapter && typeof adapter.matches === 'function' && adapter.matches(element)
      }) || null
    }
  },
  eventsToBind: {
    form: (form) => ({
      submit: (eventData) => {
        if (!ClientSideValidations.isValid(form, form.ClientSideValidations.settings.validators)) {
          eventData.preventDefault()
          eventData.stopImmediatePropagation()
        }
      },
      'ajax:beforeSend': function (eventData) {
        if (eventData.target === this) {
          ClientSideValidations.isValid(form, form.ClientSideValidations.settings.validators)
        }
      },
      'form:validate:after': (eventData) => {
        ClientSideValidations.callbacks.form.after(form, eventData)
      },
      'form:validate:before': (eventData) => {
        ClientSideValidations.callbacks.form.before(form, eventData)
      },
      'form:validate:fail': (eventData) => {
        ClientSideValidations.callbacks.form.fail(form, eventData)
      },
      'form:validate:pass': (eventData) => {
        ClientSideValidations.callbacks.form.pass(form, eventData)
      }
    }),
    input: (form) => ({
      focusout: function () {
        ClientSideValidations.isValid(this, form.ClientSideValidations.settings.validators)
      },
      change: function () {
        this.dataset.csvChanged = 'true'
      },
      'element:validate:after': function (eventData) {
        ClientSideValidations.callbacks.element.after(this, eventData)
      },
      'element:validate:before': function (eventData) {
        ClientSideValidations.callbacks.element.before(this, eventData)
      },
      'element:validate:fail': function (eventData) {
        const element = this
        const message = eventData.detail

        ClientSideValidations.callbacks.element.fail(element, message, function () {
          form.ClientSideValidations.addError(element, message)
        }, eventData)
      },
      'element:validate:pass': function (eventData) {
        const element = this

        ClientSideValidations.callbacks.element.pass(element, function () {
          form.ClientSideValidations.removeError(element)
        }, eventData)
      }
    }),
    inputConfirmation: (elementToConfirm, form) => ({
      focusout: () => {
        elementToConfirm.dataset.csvChanged = 'true'
        ClientSideValidations.isValid(elementToConfirm, form.ClientSideValidations.settings.validators)
      },
      keyup: () => {
        elementToConfirm.dataset.csvChanged = 'true'
        ClientSideValidations.isValid(elementToConfirm, form.ClientSideValidations.settings.validators)
      }
    })
  },
  enablers: {
    form: (form) => {
      clearBoundEventListeners(form)
      getFormControls(form).forEach((input) => {
        clearBoundEventListeners(input)
        clearAdapterBinding(input)
      })

      const settings = JSON.parse(form.dataset.clientSideValidations)

      form.ClientSideValidations = {
        settings,
        addError: (element, message) => {
          const adapter = getElementAdapter(element)

          if (adapter && typeof adapter.addError === 'function') {
            adapter.addError(element, message, settings.html_settings)
            return
          }

          ClientSideValidations
            .formBuilders[settings.html_settings.type]
            .add(element, settings.html_settings, message)
        },
        removeError: (element) => {
          const adapter = getElementAdapter(element)

          if (adapter && typeof adapter.removeError === 'function') {
            adapter.removeError(element, settings.html_settings)
            return
          }

          ClientSideValidations
            .formBuilders[settings.html_settings.type]
            .remove(element, settings.html_settings)
        }
      }

      bindElementEvents(form, ClientSideValidations.eventsToBind.form(form))

      getFormInputs(form).forEach((element) => {
        ClientSideValidations.enablers.input(element)
      })
    },
    input: function (input) {
      const form = input.form

      if (!form) {
        return
      }

      clearBoundEventListeners(input)
      clearAdapterBinding(input)

      const eventsToBind = ClientSideValidations.eventsToBind.input(form)
      const validationEventsToBind = {
        'element:validate:after': eventsToBind['element:validate:after'],
        'element:validate:before': eventsToBind['element:validate:before'],
        'element:validate:fail': eventsToBind['element:validate:fail'],
        'element:validate:pass': eventsToBind['element:validate:pass']
      }
      const isConfirmationInput = input.id && input.id.endsWith('_confirmation')
      const adapterBound = bindAdapterInput(input, form)

      if (input.type !== 'radio' && !isConfirmationInput) {
        input.dataset.csvValidate = 'true'

        if (adapterBound) {
          bindElementEvents(input, validationEventsToBind)
          return
        }

        bindElementEvents(input, eventsToBind)
      }

      if (input.type === 'checkbox') {
        bindElementEvents(input, {
          change: function () {
            ClientSideValidations.isValid(this, form.ClientSideValidations.settings.validators)
          }
        })
      }

      if (isConfirmationInput) {
        const elementToConfirm = document.getElementById(input.id.match(/(.+)_confirmation/)[1])

        if (elementToConfirm && elementToConfirm.form === form) {
          bindElementEvents(input, ClientSideValidations.eventsToBind.inputConfirmation(elementToConfirm, form))
        }
      }
    }
  },
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: (element, settings, message) => {
        if (!element) {
          return
        }

        const form = element.form

        const inputErrorTemplate = createElementFromHTML(settings.input_tag)
        let inputErrorElement = element.closest(`.${inputErrorTemplate.getAttribute('class').replace(/ /g, '.')}`)

        if (!inputErrorElement) {
          inputErrorElement = inputErrorTemplate

          if (element.getAttribute('autofocus')) {
            element.setAttribute('autofocus', false)
          }

          element.before(inputErrorElement)
          inputErrorElement.querySelector('span#input_tag').replaceWith(element)

          const inputErrorLabelMessageElement = inputErrorElement.querySelector('label.message')

          if (inputErrorLabelMessageElement) {
            inputErrorLabelMessageElement.setAttribute('for', element.id)
          }
        }

        const labelElement = form.querySelector(`label[for="${element.id}"]:not(.message)`)

        if (labelElement) {
          const labelErrorTemplate = createElementFromHTML(settings.label_tag)
          const labelErrorContainer = labelElement.closest(`.${labelErrorTemplate.getAttribute('class').replace(/ /g, '.')}`)

          if (!labelErrorContainer) {
            labelElement.after(labelErrorTemplate)
            labelErrorTemplate.querySelector('label#label_tag').replaceWith(labelElement)
          }
        }

        const labelMessageElement = form.querySelector(`label.message[for="${element.id}"]`)

        if (labelMessageElement) {
          labelMessageElement.textContent = message
        }
      },
      remove: (element, settings) => {
        if (!element) {
          return
        }

        const form = element.form

        const inputErrorClass = createElementFromHTML(settings.input_tag).getAttribute('class')
        const inputErrorElement = element.closest(`.${inputErrorClass.replace(/ /g, '.')}`)

        if (inputErrorElement) {
          inputErrorElement.querySelector(`#${element.id}`).remove()
          inputErrorElement.replaceWith(element)
        }

        const labelElement = form.querySelector(`label[for="${element.id}"]:not(.message)`)

        if (labelElement) {
          const labelErrorClass = createElementFromHTML(settings.label_tag).getAttribute('class')
          const labelErrorElement = labelElement.closest(`.${labelErrorClass.replace(/ /g, '.')}`)

          if (labelErrorElement) {
            labelErrorElement.replaceWith(labelElement)
          }
        }

        const labelMessageElement = form.querySelector(`label.message[for="${element.id}"]`)

        if (labelMessageElement) {
          labelMessageElement.remove()
        }
      }
    }
  },
  patterns: {
    numericality: {
      default: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
      only_integer: /^[+-]?\d+$/
    }
  },
  selectors: {
    forms: 'form[data-client-side-validations]'
  },
  validators: {
    all: () => {
      return {
        ...ClientSideValidations.validators.local,
        ...ClientSideValidations.validators.remote
      }
    },
    local: {},
    remote: {}
  },
  disable: (target) => {
    getDOMElements(target).forEach((element) => {
      clearBoundEventListeners(element)

      if (isFormElement(element)) {
        getFormControls(element).forEach((input) => {
          clearBoundEventListeners(input)
          clearAdapterBinding(input)
          delete input.dataset.csvValid
          delete input.dataset.csvChanged
          delete input.dataset.csvValidate
        })

        return
      }

      delete element.dataset.csvValid
      delete element.dataset.csvChanged

      if (isInputElement(element)) {
        clearAdapterBinding(element)
        delete element.dataset.csvValidate
      }
    })
  },
  reset: (form) => {
    ClientSideValidations.disable(form)

    for (const key in form.ClientSideValidations.settings.validators) {
      const element = findFormElementByName(form, key)

      if (element) {
        form.ClientSideValidations.removeError(element)
      }
    }

    ClientSideValidations.enablers.form(form)
  },
  initializeOnEvent: () => {
    if (window.Turbo != null) {
      return 'turbo:load'
    } else if ((window.Turbolinks != null) && window.Turbolinks.supported) {
      return (window.Turbolinks.EVENTS != null) ? 'page:change' : 'turbolinks:load'
    }
  },
  start: () => {
    const initializeOnEvent = ClientSideValidations.initializeOnEvent()

    if (initializeOnEvent != null) {
      document.addEventListener(initializeOnEvent, enableForms)
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enableForms, { once: true })
    } else {
      enableForms()
    }
  }
}

export default ClientSideValidations

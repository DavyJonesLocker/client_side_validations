import { bindElementEvents, clearBoundEventListeners } from './events'
import { createElementFromHTML, getDOMElements, isFormElement, isInputElement, isVisible } from './utils'

const isNamedInputElement = (element) => {
  return isInputElement(element) && element.name != null && element.name !== ''
}

const getFormControls = (form) => {
  return Array.from(form.elements).filter(isInputElement)
}

const getFormInputs = (form) => {
  return getFormControls(form).filter((element) => {
    return isNamedInputElement(element) && !element.disabled && isVisible(element)
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
      getFormControls(form).forEach(clearBoundEventListeners)

      form.ClientSideValidations = {
        settings: JSON.parse(form.dataset.clientSideValidations),
        addError: (element, message) => ClientSideValidations
          .formBuilders[form.ClientSideValidations.settings.html_settings.type]
          .add(element, form.ClientSideValidations.settings.html_settings, message),
        removeError: (element) => ClientSideValidations
          .formBuilders[form.ClientSideValidations.settings.html_settings.type]
          .remove(element, form.ClientSideValidations.settings.html_settings)
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

      const eventsToBind = ClientSideValidations.eventsToBind.input(form)

      if (input.type !== 'radio' && !(input.id && input.id.endsWith('_confirmation'))) {
        input.dataset.csvValidate = 'true'
        bindElementEvents(input, eventsToBind)
      }

      if (input.type === 'checkbox') {
        bindElementEvents(input, {
          change: function () {
            ClientSideValidations.isValid(this, form.ClientSideValidations.settings.validators)
          }
        })
      }

      if (input.id && input.id.endsWith('_confirmation')) {
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
    inputs: 'input:not([type="submit"]):not([type="button"])[name], select[name], textarea[name]',
    validate_inputs: 'input[data-csv-validate]:not([type="submit"]):not([type="button"]), select[data-csv-validate], textarea[data-csv-validate]',
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
          delete input.dataset.csvValid
          delete input.dataset.csvChanged
          delete input.dataset.csvValidate
        })

        return
      }

      delete element.dataset.csvValid
      delete element.dataset.csvChanged

      if (isInputElement(element)) {
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

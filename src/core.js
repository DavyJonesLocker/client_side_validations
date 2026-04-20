import { createElementFromHTML } from './utils'

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
  validators: {
    all: () => {
      return {
        ...ClientSideValidations.validators.local,
        ...ClientSideValidations.validators.remote
      }
    },
    local: {},
    remote: {}
  }
}

export default ClientSideValidations

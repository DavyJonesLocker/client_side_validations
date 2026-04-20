import ClientSideValidations from './core'
import { bindElementEvents, clearBoundEventListeners } from './events'
import { isValid } from './validate'

const buildErrorHelpers = (settings) => ({
  addError: (element, message) => ClientSideValidations
    .formBuilders[settings.html_settings.type]
    .add(element, settings.html_settings, message),
  removeError: (element) => ClientSideValidations
    .formBuilders[settings.html_settings.type]
    .remove(element, settings.html_settings)
})

export const installFormContext = (form, settings) => {
  const { addError, removeError } = buildErrorHelpers(settings)

  form.ClientSideValidations = { settings, addError, removeError }
}

export const removeFormContext = (form) => {
  delete form.ClientSideValidations
}

export const bindFormEvents = (form) => {
  bindElementEvents(form, {
    submit: (event) => {
      if (!isValid(form, form.ClientSideValidations.settings.validators)) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    },
    'form:validate:after': (event) => ClientSideValidations.callbacks.form.after(form, event),
    'form:validate:before': (event) => ClientSideValidations.callbacks.form.before(form, event),
    'form:validate:fail': (event) => ClientSideValidations.callbacks.form.fail(form, event),
    'form:validate:pass': (event) => ClientSideValidations.callbacks.form.pass(form, event)
  })
}

export const bindInputEvents = (form, input) => {
  input.dataset.csvValidate = 'true'

  bindElementEvents(input, {
    focusout: function () {
      isValid(this, form.ClientSideValidations.settings.validators)
    },
    change: function () {
      this.dataset.csvChanged = 'true'
    },
    'element:validate:after': function (event) {
      ClientSideValidations.callbacks.element.after(this, event)
    },
    'element:validate:before': function (event) {
      ClientSideValidations.callbacks.element.before(this, event)
    },
    'element:validate:fail': function (event) {
      const element = this
      const message = event.detail

      ClientSideValidations.callbacks.element.fail(element, message, () => {
        form.ClientSideValidations.addError(element, message)
      }, event)
    },
    'element:validate:pass': function (event) {
      const element = this

      ClientSideValidations.callbacks.element.pass(element, () => {
        form.ClientSideValidations.removeError(element)
      }, event)
    }
  })

  if (input.type === 'checkbox') {
    bindElementEvents(input, {
      change: function () {
        isValid(this, form.ClientSideValidations.settings.validators)
      }
    })
  }
}

export const bindConfirmationEvents = (target, confirmation, form) => {
  bindElementEvents(confirmation, {
    focusout: () => {
      target.dataset.csvChanged = 'true'
      isValid(target, form.ClientSideValidations.settings.validators)
    },
    keyup: () => {
      target.dataset.csvChanged = 'true'
      isValid(target, form.ClientSideValidations.settings.validators)
    }
  })
}

export const unbindElement = (element) => {
  clearBoundEventListeners(element)
  delete element.dataset.csvValid
  delete element.dataset.csvChanged
  delete element.dataset.csvValidate
}

// Bundled exclusively for the QUnit browser test suite. Not published.
//
// Wires the Stimulus-only client_side_validations runtime into a single
// classic-script payload that exposes everything the QUnit fixtures need on
// `window`. Most QUnit tests cover the underlying lifecycle layer directly so
// they can stay synchronous; a separate Stimulus controller module exercises
// the Stimulus integration end-to-end.

import { Application } from '@hotwired/stimulus'

import {
  ClientSideValidations,
  ClientSideValidationsController,
  isValid,
  register
} from '../../src/index.js'

import {
  bindConfirmationEvents,
  bindFormEvents,
  bindInputEvents,
  installFormContext,
  removeFormContext,
  unbindElement
} from '../../src/lifecycle.js'

const application = Application.start()
register(application)

const isValidatableInput = (element) => {
  if (!element.name) return false
  if (element.type === 'submit' || element.type === 'button') return false
  if (element.type === 'radio') return false
  return true
}

const setupForm = (form, settings) => {
  form.noValidate = true
  installFormContext(form, settings)
  bindFormEvents(form)

  Array.from(form.elements).forEach((input) => {
    if (!isValidatableInput(input)) return

    if (input.id && input.id.endsWith('_confirmation')) {
      const partner = document.getElementById(input.id.replace(/_confirmation$/, ''))
      if (partner && partner.form === form) {
        bindConfirmationEvents(partner, input, form)
      }
      return
    }

    bindInputEvents(form, input)
  })
}

const teardownForm = (form) => {
  unbindElement(form)
  Array.from(form.elements).forEach(unbindElement)
  removeFormContext(form)
}

const resetForm = (form) => {
  if (!form.ClientSideValidations) return
  const settings = form.ClientSideValidations.settings
  for (const key in settings.validators) {
    const element = Array.from(form.elements).find((el) => el.name === key)
    if (element) form.ClientSideValidations.removeError(element)
  }
  teardownForm(form)
  setupForm(form, settings)
}

window.Stimulus = application
window.ClientSideValidations = ClientSideValidations
window.ClientSideValidationsController = ClientSideValidationsController
window.csvSetup = setupForm
window.csvTeardown = teardownForm
window.csvReset = resetForm

// Back-compat shims so existing QUnit test bodies keep working unchanged.
const disable = (target) => {
  if (target == null) return

  if (target instanceof HTMLFormElement) {
    teardownForm(target)
    return
  }

  if (target instanceof Element) {
    unbindElement(target)
    return
  }

  if (typeof target.length === 'number' || Symbol.iterator in Object(target)) {
    Array.from(target).forEach((node) => {
      if (node instanceof Element) unbindElement(node)
    })
  }
}

const enable = (target) => {
  if (target instanceof HTMLFormElement) {
    const settings = target.ClientSideValidations?.settings ||
      JSON.parse(target.dataset.clientSideValidations || '{}')
    setupForm(target, settings)
    return
  }

  if (target instanceof Element && target.form) {
    bindInputEvents(target.form, target)
  }
}

ClientSideValidations.validate = (form) => setupForm(form, JSON.parse(form.dataset.clientSideValidations || '{}'))
ClientSideValidations.disable = disable
ClientSideValidations.enable = enable
ClientSideValidations.reset = resetForm
ClientSideValidations.isValid = isValid

import { Controller } from '@hotwired/stimulus'

import {
  bindConfirmationEvents,
  bindFormEvents,
  bindInputEvents,
  installFormContext,
  removeFormContext,
  unbindElement
} from '../lifecycle'

import { isValid } from '../validate'

export default class extends Controller {
  static targets = ['input', 'confirmation']
  static values = { settings: Object }

  connect () {
    this.element.noValidate = true
    installFormContext(this.element, this.settingsValue)
    bindFormEvents(this.element)
  }

  disconnect () {
    unbindElement(this.element)

    this.inputTargets.forEach((input) => {
      unbindElement(input)
    })

    this.confirmationTargets.forEach((confirmation) => {
      unbindElement(confirmation)
    })

    removeFormContext(this.element)
  }

  inputTargetConnected (input) {
    if (input.type === 'radio' || !input.form || input.form !== this.element) {
      return
    }

    bindInputEvents(this.element, input)
  }

  inputTargetDisconnected (input) {
    unbindElement(input)
  }

  confirmationTargetConnected (confirmation) {
    if (!confirmation.form || confirmation.form !== this.element) {
      return
    }

    const partner = this.#findConfirmationPartner(confirmation)

    if (partner) {
      bindConfirmationEvents(partner, confirmation, this.element)
    }
  }

  confirmationTargetDisconnected (confirmation) {
    unbindElement(confirmation)
  }

  validate () {
    return isValid(this.element, this.settingsValue.validators)
  }

  validateElement (element) {
    return isValid(element, this.settingsValue.validators)
  }

  #findConfirmationPartner (confirmation) {
    const partnerId = confirmation.dataset.clientSideValidationsConfirms

    if (partnerId) {
      const partner = document.getElementById(partnerId)
      if (partner && partner.form === this.element) return partner
    }

    if (confirmation.id && confirmation.id.endsWith('_confirmation')) {
      const fallback = document.getElementById(confirmation.id.replace(/_confirmation$/, ''))
      if (fallback && fallback.form === this.element) return fallback
    }

    return null
  }
}

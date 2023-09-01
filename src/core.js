import jQuery from 'jquery'
import { createElementFromHTML } from './utils'

const ClientSideValidations = {
  callbacks: {
    element: {
      after: ($element, eventData) => {},
      before: ($element, eventData) => {},
      fail: ($element, message, addError, eventData) => addError(),
      pass: ($element, removeError, eventData) => removeError()
    },
    form: {
      after: ($form, eventData) => {},
      before: ($form, eventData) => {},
      fail: ($form, eventData) => {},
      pass: ($form, eventData) => {}
    }
  },
  eventsToBind: {
    form: (form, $form) => ({
      'submit.ClientSideValidations': (eventData) => {
        if (!$form.isValid(form.ClientSideValidations.settings.validators)) {
          eventData.preventDefault()
          eventData.stopImmediatePropagation()
        }
      },
      'ajax:beforeSend.ClientSideValidations': function (eventData) {
        if (eventData.target === this) {
          $form.isValid(form.ClientSideValidations.settings.validators)
        }
      },
      'form:validate:after.ClientSideValidations': (eventData) => {
        ClientSideValidations.callbacks.form.after($form, eventData)
      },
      'form:validate:before.ClientSideValidations': (eventData) => {
        ClientSideValidations.callbacks.form.before($form, eventData)
      },
      'form:validate:fail.ClientSideValidations': (eventData) => {
        ClientSideValidations.callbacks.form.fail($form, eventData)
      },
      'form:validate:pass.ClientSideValidations': (eventData) => {
        ClientSideValidations.callbacks.form.pass($form, eventData)
      }
    }),
    input: (form) => ({
      'focusout.ClientSideValidations': function () {
        jQuery(this).isValid(form.ClientSideValidations.settings.validators)
      },
      'change.ClientSideValidations': function () {
        jQuery(this).data('changed', true)
      },
      'element:validate:after.ClientSideValidations': function (eventData) {
        ClientSideValidations.callbacks.element.after(jQuery(this), eventData)
      },
      'element:validate:before.ClientSideValidations': function (eventData) {
        ClientSideValidations.callbacks.element.before(jQuery(this), eventData)
      },
      'element:validate:fail.ClientSideValidations': function (eventData, message) {
        const $element = jQuery(this)

        ClientSideValidations.callbacks.element.fail($element, message, function () {
          form.ClientSideValidations.addError($element, message)
        }, eventData)
      },
      'element:validate:pass.ClientSideValidations': function (eventData) {
        const $element = jQuery(this)

        ClientSideValidations.callbacks.element.pass($element, function () {
          form.ClientSideValidations.removeError($element)
        }, eventData)
      }
    }),
    inputConfirmation: ($element, form) => ({
      'focusout.ClientSideValidations': () => {
        $element.data('changed', true).isValid(form.ClientSideValidations.settings.validators)
      },
      'keyup.ClientSideValidations': () => {
        $element.data('changed', true).isValid(form.ClientSideValidations.settings.validators)
      }
    })
  },
  enablers: {
    form: (form) => {
      const $form = jQuery(form)

      form.ClientSideValidations = {
        settings: $form.data('clientSideValidations'),
        addError: ($element, message) => ClientSideValidations
          .formBuilders[form.ClientSideValidations.settings.html_settings.type]
          .add($element, form.ClientSideValidations.settings.html_settings, message),
        removeError: ($element) => ClientSideValidations
          .formBuilders[form.ClientSideValidations.settings.html_settings.type]
          .remove($element, form.ClientSideValidations.settings.html_settings)
      }

      const eventsToBind = ClientSideValidations.eventsToBind.form(form, $form)

      for (const eventName in eventsToBind) {
        const eventFunction = eventsToBind[eventName]
        $form.on(eventName, eventFunction)
      }

      $form.find(ClientSideValidations.selectors.inputs).each(function () {
        ClientSideValidations.enablers.input(this)
      })
    },
    input: function (input) {
      const $input = jQuery(input)
      const form = input.form
      const $form = jQuery(form)

      const eventsToBind = ClientSideValidations.eventsToBind.input(form)

      for (const eventName in eventsToBind) {
        const eventFunction = eventsToBind[eventName]

        $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
          jQuery(this).attr('data-validate', true)
        }).on(eventName, eventFunction)
      }

      $input.filter(':checkbox').on('change.ClientSideValidations', function () {
        jQuery(this).isValid(form.ClientSideValidations.settings.validators)
      })

      $input.filter('[id$=_confirmation]').each(function () {
        const $element = jQuery(this)
        const $elementToConfirm = $form.find(`#${this.id.match(/(.+)_confirmation/)[1]}:input`)

        if ($elementToConfirm.length) {
          const eventsToBind = ClientSideValidations.eventsToBind.inputConfirmation($elementToConfirm, form)

          for (const eventName in eventsToBind) {
            const eventFunction = eventsToBind[eventName]
            jQuery(`#${$element.attr('id')}`).on(eventName, eventFunction)
          }
        }
      })
    }
  },
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: ($element, settings, message) => {
        const element = $element[0]

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
      remove: ($element, settings) => {
        const element = $element[0]

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
    inputs: ':input:not(button):not([type="submit"])[name]:visible:enabled',
    validate_inputs: ':input:enabled:visible[data-validate]',
    forms: 'form[data-client-side-validations]'
  },
  validators: {
    all: () => { return jQuery.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote) },
    local: {},
    remote: {}
  },
  disable: (target) => {
    const $target = jQuery(target)

    $target.off('.ClientSideValidations')

    if ($target.is('form')) {
      ClientSideValidations.disable($target.find(':input'))
    } else {
      $target.removeData(['changed', 'valid'])
      $target.filter(':input').each(function () {
        jQuery(this).removeAttr('data-validate')
      })
    }
  },
  reset: (form) => {
    const $form = jQuery(form)

    ClientSideValidations.disable(form)

    for (const key in form.ClientSideValidations.settings.validators) {
      form.ClientSideValidations.removeError($form.find(`[name="${key}"]`))
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
      jQuery(document).on(initializeOnEvent, () => jQuery(ClientSideValidations.selectors.forms).validate())
    } else {
      jQuery(() => jQuery(ClientSideValidations.selectors.forms).validate())
    }
  }
}

export default ClientSideValidations

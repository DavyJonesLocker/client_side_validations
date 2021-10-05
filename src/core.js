import jQuery from 'jquery'

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
        const $form = jQuery($element[0].form)

        if ($element.data('valid') !== false && ($form.find(`label.message[for="${$element.attr('id')}"]`)[0] == null)) {
          const $inputErrorField = jQuery(settings.input_tag)
          const $labelErrorField = jQuery(settings.label_tag)
          const $label = $form.find(`label[for="${$element.attr('id')}"]:not(.message)`)
          if ($element.attr('autofocus')) {
            $element.attr('autofocus', false)
          }
          $element.before($inputErrorField)
          $inputErrorField.find('span#input_tag').replaceWith($element)
          $inputErrorField.find('label.message').attr('for', $element.attr('id'))
          $labelErrorField.find('label.message').attr('for', $element.attr('id'))
          $labelErrorField.insertAfter($label)
          $labelErrorField.find('label#label_tag').replaceWith($label)
        }
        $form.find(`label.message[for="${$element.attr('id')}"]`).text(message)
      },
      remove: ($element, settings) => {
        const $form = jQuery($element[0].form)
        const $inputErrorFieldClass = jQuery(settings.input_tag).attr('class')
        const $inputErrorField = $element.closest(`.${$inputErrorFieldClass.replace(/ /g, '.')}`)
        const $label = $form.find(`label[for="${$element.attr('id')}"]:not(.message)`)

        const $labelErrorFieldClass = jQuery(settings.label_tag).attr('class')
        const $labelErrorField = $label.closest(`.${$labelErrorFieldClass.replace(/ /g, '.')}`)

        if ($inputErrorField[0]) {
          $inputErrorField.find(`#${$element.attr('id')}`).detach()
          $inputErrorField.replaceWith($element)
          $label.detach()
          $labelErrorField.replaceWith($label)
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

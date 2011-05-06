###
* Rails 3 Client Side Validations - v3.0.4
* https://github.com/bcardarlela/client_side_validations
*
* Copyright (c) 2011 Brian Cardarella
* Licensed under the MIT license
* http://www.opensource.org/licenses/mit-license.php
*
*  CoffeeScript Version is by Amr Numan Tamimi - v3.0.4.CoffeeScript
###

(($) ->
  $.fn.validate = ->
    @.filter('form[data-validate]').each ->
      form = $(@)
      settings = window[form.attr('id')]

      # Set up the events for the form
      form
        .submit ->
          form.isValid(settings. validators)
        .bind  'ajax:beforeSend', ->
          form.isValid(settings.validators)
        # Callbacks
        .bind 'form:validate:after', (eventData) ->
          clientSideValidations.callbacks.form.after(form, eventData)
        .bind 'form:validate:before', (eventData) ->
          clientSideValidations.callbacks.form.before(form, eventData)
        .bind 'form:validate:fail', (eventData) ->
          clientSideValidations.callbacks.form.fail(form, eventData)
        .bind 'form:validate:pass', (eventData) ->
          clientSideValidations.callbacks.form.pass(form, eventData)
        # Set up the events for each validatable form element
        .find('[data-validate]:input')
          .live 'focusout', ->
            $(@).isValid(settings.validators)
          .live 'change', ->
            $(@).data('changed', true)
          # Callbacks
          .live 'element:validate:after', (eventData) ->
            clientSideValidations.callbacks.element.after( $(@), eventData)
          .live 'element:validate:before', (eventData) ->
            clientSideValidations.callbacks.element.before($(@), eventData)
          .live 'element:validate:fail', (eventData, message) ->
            element = $(this)
            clientSideValidations.callbacks.element.fail element, message, ( ->
              addError(element, message)
            ), eventData

          .live 'element:validate:pass', (eventData) ->
            element = $(this)
            clientSideValidations.callbacks.element.pass element,( ->
              removeError(element)), eventData

          # Checkboxes - Live events don't support filter
          .end().find('[data-validate]:checkbox')
            .live 'click', ->
              $(@).isValid(settings.validators)
          # Inputs for confirmations
          .end().find('[id*=_confirmation]').each ->
            confirmationElement = $(@)
            element = form.find("##{@.id.match(/(.+)_confirmation/)[1]}[data-validate]:input")
            if element[0]
              $("##{confirmationElement.attr('id')}")
                .live('focusout', ->
                  element.data('changed', true).isValid(settings.validators)
                )
              .live('keyup', ->
                  element.data('changed', true).isValid(settings.validators)
              )
      addError = (element, message) ->
        clientSideValidations.formBuilders[settings.type].add(element, settings, message)

      removeError = (element) ->
        clientSideValidations.formBuilders[settings.type].remove(element, settings)

  $.fn.isValid = (validators) ->
    if $(@[0]).is('form')
      validateForm($(@[0]), validators)
    else
      validateElement($(@[0]), validators[@[0].name])

  validateForm = (form, validators) ->
    valid = true

    form.trigger('form:validate:before').find('[data-validate]:input').each ->
      valid = false if not $(@).isValid(validators)

    if valid
      form.trigger('form:validate:pass')
    else
      form.trigger('form:validate:fail')

    form.trigger('form:validate:after')
    valid

  validateElement = (element, validators) ->
    element.trigger('element:validate:before')
 
    if element.data('changed') isnt false
      valid = true
      element.data('changed', false)

      ###
      Because 'length' is defined on the list of validators we cannot call jQuery.each on
      the clientSideValidations.validators.all() object
      ###
      for kind of clientSideValidations.validators.all()
        if validators[kind] and (message = clientSideValidations.validators.all()[kind](element, validators[kind]))
          element.trigger('element:validate:fail', message).data('valid', false)
          valid = false
          break

      if valid
        element.data('valid', null)
        element.trigger('element:validate:pass')
    element.trigger('element:validate:after')
    if element.data('valid') is false
      false
    else
      true

  $ ->
    $('form[data-validate]').validate()
)(jQuery)

clientSideValidations = {
  validators: {
    all: -> jQuery.extend({}, clientSideValidations.validators.local, clientSideValidations.validators.remote)
    local: {
      presence: (element, options) ->
        if /^\s*$/.test(element.val())
          options.message
      acceptance: (element, options) ->
        switch element.attr('type')
          when 'checkbox'
            if not element.attr('checked')
              return options.message
            break
          when 'text'
            if element.val() isnt (options.accept or '1')
              return options.message
            break
      format: (element, options) ->
        if (message = this.presence(element, options)) and options.allow_blank is true
        else if message
          message
        else
          if options['with'] and not options['with'].test(element.val())
            options.message
          else if options['without'] and options['without'].test(element.val())
            options.message
      numericality: (element, options) ->
        if !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(element.val())
          return options.messages.numericality
        if options.only_integer and !/^\d+$/.test(element.val())
          return options.messages.only_integer
        CHECKS = { 
          greater_than: '>',
          greater_than_or_equal_to: '>=',
          equal_to: '==',
          less_than: '<',
          less_than_or_equal_to: '<='
        }
        for check of CHECKS
          if options[check] and not (new Function("return " + element.val() + CHECKS[check] + options[check])())
            return options.messages[check]
        if options.odd and not (parseInt(element.val()) % 2)
          return options.messages.odd
        if options.even and (parseInt(element.val()) % 2)
          return options.messages.even
      length: (element, options) ->
        blankOptions = {}
        if options.is
          blankOptions.message = options.messages.is
        else if options.minimum
          blankOptions.message = options.messages.minimum
        if (message = this.presence(element, blankOptions)) and options.allow_blank is true and not options.maximum
        else if message
          message
        else
          CHECKS = { is: '==', minimum: '>=', maximum: '<=' }
          tokenizer = options.js_tokenizer || "split('')"
          tokenized_length = new Function("element", "return (element.val()." + tokenizer + " || '').length;")(element)
          for check of CHECKS
            if options[check] and  not (new Function("return " + tokenized_length + CHECKS[check] + options[check])())
              return options.messages[check] 
      exclusion: (element, options) ->
        if ((message = this.presence(element, options)) and options.allow_blank is true)
        else if message
          message
        else
          if options['in']
            for i in [0..options['in'].length]
              if options['in'][i] is element.val()
                return options.message
          else if options['range']
            lower = options['range'][0]
            upper = options['range'][1]
            if element.val() >= lower and element.val() <= upper
              options.message
      inclusion: (element, options) ->
        if (message = this.presence(element, options)) and options.allow_blank is true
        else if message
          message
        else
          if options['in']
            for i in [0..options['in'].length]
              return if options['in'][i] is element.val()
            options.message
          else if options['range']
            lower = options['range'][0]
            upper = options['range'][1]
            if element.val() >= lower and element.val() <= upper
            else
              options.message

      confirmation: (element, options) ->
        if element.val() isnt jQuery("##{element.attr('id')}_confirmation").val()
          options.message
    }
    remote: {
      uniqueness: (element, options) ->
        data = {}
        data['case_sensitive'] = !!options.case_sensitive
        if options.id
          data['id'] = options.id

        if options.scope
          data.scope = {}
          for key of options.scope
            scoped_element = jQuery('[name="' + element.attr('name').replace(/\[\w+]$/, '[' + key + ']' + '"]'))
            if scoped_element[0] and scoped_element.val() != options.scope[key]
              data.scope[key] = scoped_element.val()
              scoped_element.unbind("change.#{element.i}").bind "change.#{element.id}", ->
                element.trigger('change')
                element.trigger('focusout')
            else
              data.scope[key] = options.scope[key]
        ###
        Kind of a hack but this will isolate the resource name and attribute.
        e.g. user[records_attributes][0][title] => records[title]
        e.g. user[record_attributes][title] => record[title]
        Server side handles classifying the resource properly
        ###
        if /_attributes]/.test(element.attr('name'))
          name = element.attr('name').match(/\[\w+_attributes]/g).pop().match(/\[(\w+)_attributes]/).pop();
          name += /(\[\w+])$/.exec(element.attr('name'))[1]
        else
          name = element.attr('name')
        data[name] = element.val()

        if jQuery.ajax({
          url: '/validators/uniqueness.json',
          data: data,
          async: false
        }).status is 200
          options.message
    }
  }
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: (element, settings, message) ->
        if element.data('valid') isnt false
          inputErrorField = jQuery(settings.input_tag)
          labelErrorField = jQuery(settings.label_tag)
          label = jQuery('label[for="' + element.attr('id') + '"]:not(.message)')

          element.attr('autofocus', false) if element.attr('autofocus')
          element.before(inputErrorField)
          inputErrorField.find('span#input_tag').replaceWith(element)
          inputErrorField.find('label.message').attr('for', element.attr('id'))
          labelErrorField.find('label.message').attr('for', element.attr('id'))
          label.replaceWith(labelErrorField)
          labelErrorField.find('label#label_tag').replaceWith(label)
        jQuery('label.message[for="' + element.attr('id') + '"]').text(message);
        return
      remove: (element, settings) ->
        errorFieldClass = jQuery(settings.input_tag).attr('class')
        inputErrorField = element.closest('.' + errorFieldClass)
        label = jQuery('label[for="' + element.attr('id') + '"]:not(.message)')
        labelErrorField = label.closest('.' + errorFieldClass)

        if inputErrorField[0]
          inputErrorField.find('#' + element.attr('id')).detach()
          inputErrorField.replaceWith(element)
          label.detach()
          labelErrorField.replaceWith(label)
          return
    }
    'SimpleForm::FormBuilder': {
      add: (element, settings, message) ->
        if element.data('valid') isnt false
          wrapper = element.closest(settings.wrapper_tag);
          wrapper.addClass(settings.wrapper_error_class);
          errorElement = $('<' + settings.error_tag + ' class="' + settings.error_class + '">' + message + '</' + settings.error_tag + '>');
          wrapper.append(errorElement);
          return
        else
          element.parent().find(settings.error_tag + '.' + settings.error_class).text(message)
          return
      remove: (element, settings) ->
        wrapper = element.closest(settings.wrapper_tag + '.' + settings.wrapper_error_class);
        wrapper.removeClass(settings.wrapper_error_class);
        errorElement = wrapper.find(settings.error_tag + '.' + settings.error_class);
        errorElement.remove();
        return
    }
    'Formtastic::SemanticFormBuilder': {
      add: (element, settings, message) ->
        if element.data('valid') isnt false
          wrapper = element.closest('li')
          wrapper.addClass('error')
          errorElement = $('<p class="' + settings.inline_error_class + '">' + message + '</p>')
          wrapper.append(errorElement)
          return
        else
          element.parent().find('p.' + settings.inline_error_class).text(message)
          return
      remove: (element, settings) ->
        wrapper = element.closest('li.error')
        wrapper.removeClass('error')
        errorElement = wrapper.find('p.' + settings.inline_error_class)
        errorElement.remove()
        return
    }
  }
  callbacks: {
    element: {
      after: (element, eventData) -> 
      before: (element, eventData) -> 
      fail: (element, message, addError, eventData) -> addError()
      pass: (element, removeError, eventData) -> removeError()
    }
    form: {
      after: (form, eventData) -> 
      before: (form, eventData) -> 
      fail: (form, eventData) ->
      pass: (form, eventData) ->
    }
  }
}
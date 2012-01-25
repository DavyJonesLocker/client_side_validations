###
  Rails 3 Client Side Validations - v<%= ClientSideValidations::VERSION %>
  https://github.com/bcardarella/client_side_validations

  Copyright (c) <%= DateTime.now.year %> Brian Cardarella
  Licensed under the MIT license
  http://www.opensource.org/licenses/mit-license.php
###

$ = jQuery
$.fn.validate = ->
  return @.filter('form[data-validate]').each ->
    form        = $(@)
    settings    = window['ClientSideValidations']['forms'][form.attr('id')]
    addError    = (element, message) ->
      ClientSideValidations.formBuilders[settings.type].add(element, settings, message)
    removeError = (element) ->
      ClientSideValidations.formBuilders[settings.type].remove(element, settings)

    # Set up the events for the form
    form
      .submit(-> form.isValid(settings.validators))
      .bind('ajax:beforeSend', (eventData) -> return form.isValid(settings.validators) if eventData.target == @)
      # Callbacks
      .bind('form:validate:after',  (eventData) -> ClientSideValidations.callbacks.form.after( form, eventData))
      .bind('form:validate:before', (eventData) -> ClientSideValidations.callbacks.form.before(form, eventData))
      .bind('form:validate:fail',   (eventData) -> ClientSideValidations.callbacks.form.fail(  form, eventData))
      .bind('form:validate:pass',   (eventData) -> ClientSideValidations.callbacks.form.pass(  form, eventData))

      # Set up events for each validatable form element
      .find('[data-validate="true"]:input:enabled:not(:radio)')
        .live('focusout', -> $(@).isValid(settings.validators))
        .live('change', -> $(@).data('changed', true))
        # Callbacks
        .live('element:validate:after',  (eventData) -> ClientSideValidations.callbacks.element.after( $(@), eventData))
        .live('element:validate:before', (eventData) -> ClientSideValidations.callbacks.element.before($(@), eventData))
        .live('element:validate:fail',   (eventData, message) ->
          element = $(@)
          ClientSideValidations.callbacks.element.fail(element, message, ->
            addError(element, message)
          , eventData))
        .live('element:validate:pass',   (eventData, message) ->
          element = $(@)
          ClientSideValidations.callbacks.element.pass(element, ->
            removeError(element)
          , eventData))
      # Checkboxes - Live events don't support filter
      .end().find('[data-validate="true"]:checkbox').live('click', -> $(@).isValid(settings.validators))
      .end().find('[id*=_confirmation]').each ->
        confirmationElement = $(@)
        element = form.find("##{@.id.match(/(.+)_confirmation/)[1]}[data-validate='true']:input")
        if element[0]
          $("##{confirmationElement.attr('id')}")
            .live('focusout', ->
              element.data('changed', true).isValid(settings.validators)
            ).live('keyup', ->
              element.data('changed', true).isValid(settings.validators)
            )

$.fn.isValid = (validators) ->
  if $(@[0]).is('form')
    return validateForm($(@[0]), validators)
  else
    return validateElement($(@[0]), validators[@[0].name])

validateForm = (form, validators) ->
  valid = true
  form.trigger('form:validate:before').find('[data-validate="true"]:input:enabled').each ->
    if !$(@).isValid(validators)
      valid = false

    if valid
      form.trigger('form:validate:pass')
    else
      form.trigger('form:validate:fail')

    form.trigger('form:validate:after')
  return valid

validateElement = (element, validators) ->
  element.trigger('element:validate:before')

  if element.data('changed') != false
    valid = true
    element.data('changed', false)

    # Because 'length' is defined on the list of validators we cannot call jQuery.each
    for kind of ClientSideValidations.validators.local
      if validators[kind] and (message = ClientSideValidations.validators.all()[kind](element, validators[kind]))
        element.trigger('element:validate:fail', message).data('valid', false)
        valid = false
        break

    if valid
      for kind of ClientSideValidations.validators.remote
        if validators[kind] and (message = ClientSideValidations.validators.all()[kind](element, validators[kind]))
          element.trigger('element:validate:fail', message).data('valid', false)
          valid = false
          break

    if valid
      element.data('valid', null)
      element.trigger('element:validate:pass')

    element.trigger('element:validate:after')
    return if element.data('valid') == false then false else true

# Main Hook
# If new forms are dynamically introduced into the DOM the .validate() function
# must be invoked on that form
$ -> $('form[data-validate]').validate()

window.ClientSideValidations =
  forms: {}
  validators:
    all: -> return $.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote)
    local:
      presence: (element, options) ->
        if (/^\s*$/.test(element.val() || ""))
          return options.message

      acceptance: (element, options) ->
        switch element.attr('type')
          when 'checkbox'
            if !element.attr('checked')
              return options.message
          when 'text'
            if element.val() != (options.accept || '1').toString()
              return options.message

      format: (element, options) ->
        if (message = @.presence(element, options)) and options.allow_blank == true
          return;
        else if message
          return message
        else
          if options['with'] and !options['with'].test(element.val())
            return options.message

      numericality: (element, options) ->
        if !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(element.val())
          return options.messages.numericality

        if options.only_integer && !/^[+-]?\d+$/.test(element.val())
          return options.messages.only_integer

        CHECKS =
          greater_than: '>'
          greater_than_or_equal_to: '>='
          equal_to: '=='
          less_than: '<'
          less_than_or_equal_to: '<='

        for check of CHECKS
          if options[check] != undefined and !(new Function("return " + element.val() + CHECKS[check] + options[check])())
            return options.messages[check]

        if options.odd && !(parseInt(element.val(), 10) % 2)
          return options.messages.odd

        if options.even && (parseInt(element.val(), 10) % 2)
          return options.messages.even

      length: (element, options) ->
        blankOptions = {}
        CHECKS =
          is: '=='
          minimum: '>='
          maximum: '<='
        tokenizer = options.js_tokenizer || "split('')"
        tokenized_length = new Function("element", "return (element.val().#{tokenizer} || '').length;")(element)

        if options.is
          blankOptions.message = options.messages.is
        else if options.minimum
          blankOptions.message = options.messages.minimum

        if (message = this.presence(element, blankOptions)) and options.allow_blank == true
          return
        else if message
          return message
        else
          for check of CHECKS
            if options[check] and !(new Function("return " + tokenized_length + CHECKS[check] + options[check])())
              return options.messages[check]

      exclusion: (element, options) ->
        lower = null
        upper = null

        if (message = this.presence(element, options)) and options.allow_blank == true
          return
        else if message
          return message
        else
          if options['in']
            for value of options['in']
              if value.toString() == element.val()
                return options.message
          else if options.range
            lower = options.range[0]
            upper = options.range[1]

            if element.val() >= lower && element.val() <= upper
              return options.message

      inclusion: (element, options) ->
        lower = null
        upper = null

        if (message = this.presence(element, options)) and options.allow_blank == true
          return
        else if message
          return message
        else
          if options['in']
            for value of options['in']
              if value.toString() == element.val()
                return
            return options.message;
          else if options.range
            lower = options.range[0]
            upper = options.range[1]

            if element.val() >= lower && element.val() <= upper
              return
            else
              return options.message

      confirmation: (element, options) ->
        if element.val() != $("##{element.attr('id')}_confirmation").val()
          return options.message

    remote:
      uniqueness: (element, options) ->
        if (message = ClientSideValidations.validators.local.presence(element, options)) and options.allow_blank == true
          return
        else if message
          return message
        else
          data = {}
          name = null
          data.case_sensitive = !!options.case_sensitive

          if options.id
            data.id = options.id

          if options.scope
            data.scope = {}
            for key of options.scope
              scoped_element = $('[name="' + element.attr('name').replace(/\[\w+\]$/, '[' + key + ']' + '"]'))
              # scoped_element = $('[name="' + element.attr('name').replace(/\[\w+\]$/, '[' + key + ']' + '"]'))
              if scoped_element[0] && scoped_element.val() != options.scope[key]
                data.scope[key] = scoped_element.val()
                scoped_element.unbind("change.#{element.id}").bind("change.#{element.id}", ->
                  element.trigger('change')
                  element.trigger('focusout')
                )
              else
                data.scope[key] = options.scope[key]

          # Kind of a hack but this will isolate the resource name and attribute.
          # e.g. user[records_attributes][0][title] => records[title]
          # e.g. user[record_attributes][title] => record[title]
          # Server side handles classifying the resource properly
          if /_attributes\]/.test(element.attr('name'))
            name = element.attr('name').match(/\[\w+_attributes\]/g).pop().match(/\[(\w+)_attributes\]/).pop()
            name += /(\[\w+\])$/.exec(element.attr('name'))[1]
          else
            name = element.attr('name')

          # Override the name if a nested module class is passed
          if options['class']
            name = "#{options['class']}[#{name.split('[')[1]}"

          data[name] = element.val()

          if $.ajax({url: '/validators/uniqueness', data: data, async: false}).status == 200
            return options.message;

  formBuilders:
    'ActionView::Helpers::FormBuilder':
      add: (element, settings, message) ->
        if element.data('valid') != false and $("label.message[for='#{element.attr('id')}']")[0] == undefined
          inputErrorField = $(settings.input_tag)
          labelErrorField = $(settings.label_tag)
          label = $("label[for='#{element.attr('id')}']:not(.message)")

          if element.attr('autofocus')
            element.attr('autofocus', false)

          element.before(inputErrorField)
          inputErrorField.find('span#input_tag').replaceWith(element)
          inputErrorField.find('label.message').attr('for', element.attr('id'))
          labelErrorField.find('label.message').attr('for', element.attr('id'))
          label.replaceWith(labelErrorField)
          labelErrorField.find('label#label_tag').replaceWith(label)

        $("label.message[for='#{element.attr('id')}']").text(message);

      remove: (element, settings) ->
        errorFieldClass = $(settings.input_tag).attr('class')
        inputErrorField = element.closest(".#{errorFieldClass}")
        label = $("label[for='#{element.attr('id')}']:not(.message)")
        labelErrorField = label.closest(".#{errorFieldClass}")

        if inputErrorField[0]
          inputErrorField.find("##{element.attr('id')}").detach()
          inputErrorField.replaceWith(element)
          label.detach()
          labelErrorField.replaceWith(label)

  callbacks:
    element:
      after:  (element, eventData)                    ->
      before: (element, eventData)                    ->
      fail:   (element, message, addError, eventData) -> addError()
      pass:   (element, removeError, eventData)       -> removeError()
    form:
      after:  (form, eventData) ->
      before: (form, eventData) ->
      fail:   (form, eventData) ->
      pass:   (form, eventData) ->

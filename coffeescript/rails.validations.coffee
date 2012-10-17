# Rails 3 Client Side Validations - v<%= ClientSideValidations::VERSION %>
# https://github.com/bcardarella/client_side_validations
#
# Copyright (c) <%= DateTime.now.year %> Brian Cardarella
# Licensed under the MIT license
# http://www.opensource.org/licenses/mit-license.php

$ = jQuery
$.fn.disableClientSideValidations = ->
  ClientSideValidations.disable(@)

$.fn.enableClientSideValidations = ->
  @filter(ClientSideValidations.selectors.forms).each ->
    ClientSideValidations.enablers.form(@)
  @filter(ClientSideValidations.selectors.inputs).each ->
    ClientSideValidations.enablers.input(@)

$.fn.resetClientSideValidations = ->
  @filter(ClientSideValidations.selectors.forms).each ->
    ClientSideValidations.reset(@)

$.fn.validate = ->
  @filter(ClientSideValidations.selectors.forms).each ->
    $(@).enableClientSideValidations()

$.fn.isValid = (validators) ->
  obj = $(@[0])
  if obj.is('form')
    validateForm(obj, validators)
  else
    validateElement(obj, validatorsFor(@[0].name, validators))

validatorsFor = (name, validators) ->
  name = name.replace(/_attributes\]\[\d+\]/g,"_attributes][]")
  validators[name] || {}

validateForm = (form, validators) ->
  form.trigger('form:validate:before.ClientSideValidations')

  valid = true
  form.find(':input:enabled:visible[data-validate]').each ->
    valid = false unless $(@).isValid(validators)
    # we don't want the loop to break out by mistake
    true

  if valid then form.trigger('form:validate:pass.ClientSideValidations') else form.trigger('form:validate:fail.ClientSideValidations')

  form.trigger('form:validate:after.ClientSideValidations')
  valid

validateElement = (element, validators) ->
  element.trigger('element:validate:before.ClientSideValidations')

  passElement = ->
    element.trigger('element:validate:pass.ClientSideValidations').data('valid', null)

  failElement = (message) ->
    element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false)
    false

  afterValidate = ->
    element.trigger('element:validate:after.ClientSideValidations').data('valid') != false

  executeValidators = (context) ->
    valid = true

    for kind, fn of context
      if validators[kind]
        for validator in validators[kind]
          if message = fn.call(context, element, validator)
            valid = failElement(message)
            break
        unless valid
          break

    valid

  # if _destroy for this input group == "1" pass with flying colours, it'll get deleted anyway..
  destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]')
  if $("input[name='#{destroyInputName}']").val() == "1"
    passElement()
    return afterValidate()

  # if the value hasn't changed since last validation, do nothing
  unless element.data('changed') != false
    return afterValidate()

  element.data('changed', false)

  local  = ClientSideValidations.validators.local
  remote = ClientSideValidations.validators.remote

  if executeValidators(local) and executeValidators(remote)
    passElement()

  afterValidate()

# Main hook
# If new forms are dynamically introduced into the DOM the .validate() method
# must be invoked on that form
$(-> $(ClientSideValidations.selectors.forms).validate())

if window.ClientSideValidations == undefined
  window.ClientSideValidations = {}

if window.ClientSideValidations.forms == undefined
  window.ClientSideValidations.forms = {}

window.ClientSideValidations.selectors =
  inputs: ':input:not(button):not([type="submit"])[name]:visible:enabled'
  forms:  'form[data-validate]'

window.ClientSideValidations.reset = (form) ->
  $form = $(form)
  ClientSideValidations.disable(form)
  ClientSideValidations.disable($form.find(':input'))
  for key of form.ClientSideValidations.settings.validators
    form.ClientSideValidations.removeError($form.find("[name='#{key}']"))

  ClientSideValidations.enablers.form(form)

window.ClientSideValidations.disable = (target) ->
  $target = $(target)
  $target.off('.ClientSideValidations')
  $target.removeData('valid')
  $target.removeData('changed')
  $target.filter(':input').each ->
    $(@).removeAttr('data-validate')

window.ClientSideValidations.enablers =
  form: (form) ->
    $form = $(form)
    form.ClientSideValidations =
      settings: window.ClientSideValidations.forms[$form.attr('id')]
      addError: (element, message) ->
        ClientSideValidations.formBuilders[form.ClientSideValidations.settings.type].add(element, form.ClientSideValidations.settings, message)
      removeError: (element) ->
        ClientSideValidations.formBuilders[form.ClientSideValidations.settings.type].remove(element, form.ClientSideValidations.settings)

    # Set up the events for the form
    $form.on(event, binding) for event, binding of {
      'submit.ClientSideValidations'              : (eventData) ->
        unless $form.isValid(form.ClientSideValidations.settings.validators)
          eventData.preventDefault()
          eventData.stopImmediatePropagation()
      'ajax:beforeSend.ClientSideValidations'     : (eventData) -> $form.isValid(form.ClientSideValidations.settings.validators) if eventData.target == @
      'form:validate:after.ClientSideValidations' : (eventData) -> ClientSideValidations.callbacks.form.after( $form, eventData)
      'form:validate:before.ClientSideValidations': (eventData) -> ClientSideValidations.callbacks.form.before($form, eventData)
      'form:validate:fail.ClientSideValidations'  : (eventData) -> ClientSideValidations.callbacks.form.fail(  $form, eventData)
      'form:validate:pass.ClientSideValidations'  : (eventData) -> ClientSideValidations.callbacks.form.pass(  $form, eventData)
    }

    $form.find(ClientSideValidations.selectors.inputs).each ->
      ClientSideValidations.enablers.input(@)

  input: (input) ->
    $input = $(input)
    form   = input.form
    $form  = $(form)

    $input.filter(':not(:radio):not([id$=_confirmation])')
      .each ->
        $(@).attr('data-validate', true)
      .on(event, binding) for event, binding of {
        'focusout.ClientSideValidations': ->
          $(@).isValid(form.ClientSideValidations.settings.validators)
        'change.ClientSideValidations':   -> $(@).data('changed', true)
        # Callbacks
        'element:validate:after.ClientSideValidations':  (eventData) -> ClientSideValidations.callbacks.element.after($(@),  eventData)
        'element:validate:before.ClientSideValidations': (eventData) -> ClientSideValidations.callbacks.element.before($(@), eventData)
        'element:validate:fail.ClientSideValidations':   (eventData, message) ->
          element = $(@)
          ClientSideValidations.callbacks.element.fail(element, message, ->
            form.ClientSideValidations.addError(element, message)
          , eventData)
        'element:validate:pass.ClientSideValidations':   (eventData) ->
          element = $(@)
          ClientSideValidations.callbacks.element.pass(element, ->
            form.ClientSideValidations.removeError(element)
          , eventData)
      }

    $input.filter(':checkbox').on('click.ClientSideValidations', ->
       $(@).isValid(form.ClientSideValidations.settings.validators)
       # If we don't return true here the checkbox will immediately uncheck itself.
       return true
    )

    # Inputs for confirmations
    $input.filter('[id$=_confirmation]').each ->
      confirmationElement = $(@)
      element = $form.find("##{@id.match(/(.+)_confirmation/)[1]}:input")
      if element[0]
        $("##{confirmationElement.attr('id')}").on(event, binding) for event, binding of {
          'focusout.ClientSideValidations': -> element.data('changed', true).isValid(form.ClientSideValidations.settings.validators)
          'keyup.ClientSideValidations'   : -> element.data('changed', true).isValid(form.ClientSideValidations.settings.validators)
        }

window.ClientSideValidations.validators =
    all: -> jQuery.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote)
    local:
      presence: (element, options) ->
        options.message if /^\s*$/.test(element.val() || '')

      acceptance: (element, options) ->
        switch element.attr('type')
          when 'checkbox'
            unless element.attr('checked')
              return options.message
          when 'text'
            if element.val() != (options.accept?.toString() || '1')
              return options.message

      format: (element, options) ->
        message = @presence(element, options)
        if message
          return if options.allow_blank == true
          return message

        return options.message if options.with and !options.with.test(element.val())
        return options.message if options.without and options.without.test(element.val())

      numericality: (element, options) ->
        val = jQuery.trim(element.val())
        unless ClientSideValidations.patterns.numericality.test(val)
          return if options.allow_blank == true
          return options.messages.numericality

        if options.only_integer and !/^[+-]?\d+$/.test(val)
          return options.messages.only_integer

        CHECKS =
          greater_than: '>'
          greater_than_or_equal_to: '>='
          equal_to: '=='
          less_than: '<'
          less_than_or_equal_to: '<='

        form = $(element[0].form)
        # options[check] may be 0 so we must check for undefined
        for check, operator of CHECKS when options[check]?
          if !isNaN(parseFloat(options[check])) && isFinite(options[check])
            check_value = options[check]
          else if form.find("[name*=#{options[check]}]").size() == 1
            check_value = form.find("[name*=#{options[check]}]").val()
          else
            return

          fn = new Function("return #{val} #{operator} #{check_value}")
          return options.messages[check] unless fn()

        if options.odd and !(parseInt(val, 10) % 2)
          return options.messages.odd

        if options.even and (parseInt(val, 10) % 2)
          return options.messages.even

      length: (element, options) ->
        tokenizer = options.js_tokenizer || "split('')"
        tokenized_length = new Function('element', "return (element.val().#{tokenizer} || '').length")(element)
        CHECKS =
          is: '=='
          minimum: '>='
          maximum: '<='
        blankOptions = {}
        blankOptions.message = if options.is
          options.messages.is
        else if options.minimum
          options.messages.minimum

        message = @presence(element, blankOptions)
        if message
          return if options.allow_blank == true
          return message

        for check, operator of CHECKS when options[check]
          fn = new Function("return #{tokenized_length} #{operator} #{options[check]}")
          return options.messages[check] unless fn()

      exclusion: (element, options) ->
        message = @presence(element, options)
        if message
          return if options.allow_blank == true
          return message

        if options.in
          return options.message if element.val() in (option.toString() for option in options.in)

        if options.range
          lower = options.range[0]
          upper = options.range[1]
          return options.message if element.val() >= lower and element.val() <= upper

      inclusion: (element, options) ->
        message = @presence(element, options)
        if message
          return if options.allow_blank == true
          return message

        if options.in
          return if element.val() in (option.toString() for option in options.in)
          return options.message

        if options.range
          lower = options.range[0]
          upper = options.range[1]
          return if element.val() >= lower and element.val() <= upper
          return options.message

      confirmation: (element, options) ->
        if element.val() != jQuery("##{element.attr('id')}_confirmation").val()
          return options.message

      uniqueness: (element, options) ->
        name = element.attr('name')

        # only check uniqueness if we're in a nested form
        if /_attributes\]\[\d/.test(name)
          matches = name.match(/^(.+_attributes\])\[\d+\](.+)$/)
          name_prefix = matches[1]
          name_suffix = matches[2]
          value = element.val()

          if name_prefix && name_suffix
            form = element.closest('form')
            valid = true

            form.find(':input[name^="' + name_prefix + '"][name$="' + name_suffix + '"]').each ->
              if $(@).attr('name') != name
                if $(@).val() == value
                  valid = false
                  $(@).data('notLocallyUnique', true)
                else
                  # items that were locally non-unique which become locally unique need to be
                  # marked as changed, so they will get revalidated and thereby have their
                  # error state cleared. but we should only do this once; therefore the
                  # notLocallyUnique flag.
                  if $(this).data('notLocallyUnique')
                    $(this)
                      .removeData('notLocallyUnique')
                      .data('changed', true)

            if(!valid)
              return options.message

    remote:
      uniqueness: (element, options) ->
        message = ClientSideValidations.validators.local.presence(element, options)
        if message
          return if options.allow_blank == true
          return message

        data = {}
        data.case_sensitive = !!options.case_sensitive
        data.id = options.id if options.id

        if options.scope
          data.scope = {}
          for key, scope_value of options.scope
            scoped_name = element.attr('name').replace(/\[\w+\]$/, "[#{key}]")
            scoped_element = jQuery("[name='#{scoped_name}']")
            jQuery("[name='#{scoped_name}']:checkbox").each ->
              if @.checked
                scoped_element = @

            if scoped_element[0] and scoped_element.val() != scope_value
              data.scope[key] = scoped_element.val()
              scoped_element.unbind("change.#{element.id}").bind "change.#{element.id}", ->
                element.trigger('change.ClientSideValidations')
                element.trigger('focusout.ClientSideValidations')
            else
              data.scope[key] = scope_value

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
        name = options['class'] + '[' + name.split('[')[1] if options['class']
        data[name] = element.val()

        if jQuery.ajax({
          url: '/validators/uniqueness',
          data: data,
          async: false
          cache: false
        }).status == 200
          return options.message

window.ClientSideValidations.formBuilders =
    'ActionView::Helpers::FormBuilder':
      add: (element, settings, message) ->
        form = $(element[0].form)
        if element.data('valid') != false and not form.find("label.message[for='#{element.attr('id')}']")[0]?
          inputErrorField = jQuery(settings.input_tag)
          labelErrorField = jQuery(settings.label_tag)
          label = form.find("label[for='#{element.attr('id')}']:not(.message)")

          element.attr('autofocus', false) if element.attr('autofocus')

          element.before(inputErrorField)
          inputErrorField.find('span#input_tag').replaceWith(element)
          inputErrorField.find('label.message').attr('for', element.attr('id'))
          labelErrorField.find('label.message').attr('for', element.attr('id'))
          labelErrorField.insertAfter(label)
          labelErrorField.find('label#label_tag').replaceWith(label)

        form.find("label.message[for='#{element.attr('id')}']").text(message)

      remove: (element, settings) ->
        form = $(element[0].form)
        errorFieldClass = jQuery(settings.input_tag).attr('class')
        inputErrorField = element.closest(".#{errorFieldClass.replace(" ", ".")}")
        label = form.find("label[for='#{element.attr('id')}']:not(.message)")
        labelErrorField = label.closest(".#{errorFieldClass}")

        if inputErrorField[0]
          inputErrorField.find("##{element.attr('id')}").detach()
          inputErrorField.replaceWith(element)
          label.detach()
          labelErrorField.replaceWith(label)

window.ClientSideValidations.patterns =
    numericality: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/

window.ClientSideValidations.callbacks =
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

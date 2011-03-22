$(document).ready(function() {
  clientSideValidations.setup();
});

var clientSideValidations = new function() {

  this.setup = function() {
    $('[data-validate]').live('submit', function() {
      return clientSideValidations.validateForm(this);
    });

    $('[data-validate]').live('ajax:beforeSend', function() {
      return clientSideValidations.validateForm(this);
    });

    $('[data-validate]').live('form:validate:after', function(eventData) {
      clientSideValidations.formValidateAfter($(this), eventData);
    });

    $('[data-validate]').live('form:validate:before', function(eventData) {
      clientSideValidations.formValidateBefore($(this), eventData);
    });

    $('[data-validate]').live('form:validate:fail', function(eventData) {
      clientSideValidations.formValidateFail($(this), eventData);
    });

    $('[data-validate]').live('form:validate:pass', function(eventData) {
      clientSideValidations.formValidatePass($(this), eventData);
    });

    $('[id*=_confirmation]').each(function() {
      if (relatedElement = document.getElementById((this.id.match(/(.+)_confirmation/)[1]))) {
        $('#'+this.id).live('keyup', function() {
          $(relatedElement).attr('changed', true);
          clientSideValidations.validateElement(relatedElement);
        });
      }
    });

    $('[data-validators]').live('focusout', function() {
      clientSideValidations.validateElement(this);
    });

    $('[data-validators]').live('change', function() {
      $(this).attr('changed', true);
    });

    $('[data-validators]').live('element:validate:after', function(eventData) {
      clientSideValidations.elementValidateAfter($(this), eventData);
    });

    $('[data-validators]').live('element:validate:before', function(eventData) {
      clientSideValidations.elementValidateBefore($(this), eventData);
    });

    $('[data-validators]').live('element:validate:fail', function(eventData, message) {
      clientSideValidations.elementValidateFail($(this), message, eventData);
    });

    $('[data-validators]').live('element:validate:pass', function(eventData) {
      var element = $(this);
      clientSideValidations.elementValidatePass(element, function() {
        clientSideValidations.detachErrorField(element)
      }, eventData);
    });

    $('[id*=_confirmation]').each(function() {
      if (relatedElement = document.getElementById((this.id.match(/(.+)_confirmation/)[1]))) {
        $('#'+this.id).live('focusout', function() {
          $(relatedElement).attr('changed', true);
          clientSideValidations.validateElement(relatedElement);
        });
      }
    });

    $('[data-validators][type="checkbox"]').live('click', function() {
      clientSideValidations.validateElement(this, 'checkbox');
    });
  }

  this.validateForm = function(form) {
    var validForm = true;
    var form = $(form);
    form.trigger('form:validate:before');

    for (var i = 0, element; element = form.find('[data-validators]')[i]; i++) {
      if (!this.validateElement(element)) { validForm = false }
    }

    if (validForm) {
      form.trigger('form:validate:pass');
    } else {
      form.trigger('form:validate:fail');
    }

    form.trigger('form:validate:after');
    return validForm;
  }

  this.validateElement = function(element) {
    var element = $(element);
    element.trigger('element:validate:before');

    if (element.attr('changed') !== "false") {
      var validElement = true;
      var validators = new Function("return " + element.attr('data-validators'))();
      var localValidators = [];
      var remoteValidators = [];

      for (var key in validators) {
        if ($.inArray(key, this.remoteValidators)) {
          localValidators.push(key);
        } else {
          remoteValidators.push(key);
        }
      }

      for (var index in localValidators.concat(remoteValidators)) {
        var key = localValidators.concat(remoteValidators)[index];
        if (this.validators[key] && (message = this.validators[key](validators[key], element))) {
          this.applyErrorField(element, message);
          validElement = false;
          break;
        }
      }

      if (validElement) {
        element.trigger('element:validate:pass');
      }

      element.attr('changed', false);
      element.attr('data-valid', validElement);
      var result = validElement;

    } else {
      var result = new Function("return " + element.attr('data-valid'))();
    }

    element.trigger('element:validate:after');
    return result;
  }

  this.detachErrorField = function(element) {
    var settings = window[element.closest('form').attr('id')];
    this['detach' + settings.type + 'ErrorField'](element, settings);
  }

  this['detachActionView::Helpers::FormBuilderErrorField'] = function(element, settings) {
    var errorFieldClass = $(settings.input_tag).attr('class');
    var inputErrorField = element.closest('.' + errorFieldClass);
    var label = $('label[for="' + element.attr('id') + '"]:not(.message)');
    var labelErrorField = label.closest('.' + errorFieldClass);

    if (inputErrorField[0]) {
      $('[data-validators]').die('focusout');
      inputErrorField.find('#' + element.attr('id')).detach();
      inputErrorField.replaceWith(element);
      $('[data-validators]').live('focusout', function() { clientSideValidations.validateElement(this) });
      label.detach();
      labelErrorField.replaceWith(label);
    }
  }

  this['detachSimpleForm::FormBuilderErrorField'] = function(element, settings) {
    var wrapper = element.closest(settings.wrapper_tag + '.' + settings.wrapper_error_class);
    wrapper.removeClass(settings.wrapper_error_class);
    var errorElement = wrapper.find(settings.error_tag + '.' + settings.error_class);
    errorElement.remove();
  }

  this['detachFormtastic::SemanticFormBuilderErrorField'] = function(element, settings) {
    var wrapper = element.closest('li.error');
    wrapper.removeClass('error');
    var errorElement = wrapper.find('p.' + settings.inline_error_class);
    errorElement.remove();
  }

  this.applyErrorField = function(element, message) {
    var settings = window[element.closest('form').attr('id')];
    this['apply' + settings.type + 'ErrorField'](element, message, settings);
    if (element.attr('data-valid') !== "false") {
      element.trigger('element:validate:fail', message);
    }
  }

  this['applyActionView::Helpers::FormBuilderErrorField'] = function(element, message, settings) {
    if (element.attr('data-valid') !== "false") {
      var inputErrorField = $(settings.input_tag);
      var labelErrorField = $(settings.label_tag);
      var label = $('label[for="' + element.attr('id') + '"]:not(.message)');

      // Killing the live event then re-enabling them is probably not very performant
      $('[data-validators]').die('focusout');
      element.before(inputErrorField);
      inputErrorField.find('span#input_tag').replaceWith(element);
      inputErrorField.find('label.message').attr('for', element.attr('id'));
      label.replaceWith(labelErrorField);
      labelErrorField.find('label#label_tag').replaceWith(label);
      $('[data-validators]').live('focusout', function() { clientSideValidations.validateElement(this) });
    }
    $('label.message[for="' + element.attr('id') + '"]').text(message);
  }

  this['applySimpleForm::FormBuilderErrorField'] = function(element, message, settings) {
    if (element.attr('data-valid') !== "false") {
      var wrapper = element.closest(settings.wrapper_tag);
      wrapper.addClass(settings.wrapper_error_class);
      var errorElement = $('<' + settings.error_tag + ' class="' + settings.error_class + '">' + message + '</' + settings.error_tag + '>');
      wrapper.append(errorElement);
    } else {
      element.parent().find(settings.error_tag + '.' + settings.error_class).text(message);
    }
  }

  this['applyFormtastic::SemanticFormBuilderErrorField'] = function(element, message, settings) {
    if (element.attr('data-valid') !== "false") {
      var wrapper = element.closest('li');
      wrapper.addClass('error');
      var errorElement = $('<p class="' + settings.inline_error_class + '">' + message + '</p>');
      wrapper.append(errorElement);
    } else {
      element.parent().find('p.' + settings.inline_error_class).text(message);
    }
  }

  this.validators = {
    acceptance: function(validator, element) {
      switch (element.attr('type')) {
        case 'checkbox':
          if (!element.attr('checked')) {
            return validator.message;
          }
          break;
        case 'text':
          if (element.val() != (validator.accept || '1')) {
            return validator.message;
          }
          break;
      }
    },
    format: function(validator, element) {
      if ((message = this.presence(validator, element)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        if (validator['with'] && !validator['with'].test(element.val())) {
          return validator.message;
        } else if (validator['without'] && validator['without'].test(element.val())) {
          return validator.message;
        }
      }
    },
    presence: function(validator, element) {
      if (/^\s*$/.test(element.val())) {
        return validator.message;
      }
    },
    numericality: function(validator, element) {
      if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(element.val())) {
        return validator.messages.numericality;
      }

      if (validator.only_integer && !/^\d+$/.test(element.val())) {
        return validator.messages.only_integer;
      }

      var CHECKS = { greater_than: '>', greater_than_or_equal_to: '>=',
        equal_to: '==', less_than: '<', less_than_or_equal_to: '<=' }

      for (var check in CHECKS) {
        if (validator[check] && !(new Function("return " + element.val() + CHECKS[check] + validator[check])())) {
          return validator.messages[check];
        }
      }

      if (validator.odd && !(parseInt(element.val()) % 2)) {
        return validator.messages.odd;
      }

      if (validator.even && (parseInt(element.val()) % 2)) {
        return validator.messages.even;
      }
    },
    length: function(validator, element) {
      var blank_validator = {};
      if (validator.is) {
        blank_validator.message = validator.messages.is;
      } else if (validator.minimum) {
        blank_validator.message = validator.messages.minimum;
      }
      if ((message = this.presence(blank_validator, element)) && validator.allow_blank == true && !validator.maximum) {
        return;
      } else if (message) {
        return message;
      } else {
        var CHECKS = { is: '==', minimum: '>=', maximum: '<=' }
        var tokenizer = validator.js_tokenizer || "split('')";
        var tokenized_length = new Function("element", "return (element.val()." + tokenizer + " || '').length;")(element);

        for (var check in CHECKS) {
          if (validator[check] && !(new Function("return " + tokenized_length + CHECKS[check] + validator[check])())) {
            return validator.messages[check];
          }
        }
      }
    },
    confirmation: function(validator, element) {
      if (element.val() != $('#' + element.attr('id') + '_confirmation').val()) {
        return validator.message;
      }
    },
    exclusion: function(validator, element) {
      if ((message = this.presence(validator, element)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        for (var i = 0; i < validator['in'].length; i++) {
          if (validator['in'][i] == element.val()) {
            return validator.message;
          }
        }
      }
    },
    inclusion: function(validator, element) {
      if ((message = this.presence(validator, element)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        for (var i = 0; i < validator['in'].length; i++) {
          if (validator['in'][i] == element.val()) {
            return;
          }
        }
        return validator.message;
      }
    },
    uniqueness: function(validator, element) {
      if ((message = this.presence(validator, element)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        var data = {};
        data['case_sensitive'] = !!validator.case_sensitive;
        if (validator.id) {
          data['id'] = validator.id;
        }

        if (validator.scope) {
          data.scope = {}
          for (key in validator.scope) {
            var scoped_element = $('[name="' + element.attr('name').replace(/\[\w+]$/, '[' + key + ']' + '"]'));
            if (scoped_element[0] && scoped_element.val() != validator.scope[key]) {
              data.scope[key] = scoped_element.val();
              scoped_element.unbind('change.' + element.id);
              scoped_element.one('change.' + element.id, function() { element.trigger('change'); element.trigger('focusout'); });
            } else {
              data.scope[key] = validator.scope[key];
            }
          }
        }

        // Kind of a hack but this will isolate the resource name and attribute.
        // e.g. user[records_attributes][0][title] => records[title]
        // e.g. user[record_attributes][title] => record[title]
        // Server side handles classifying the resource properly
        if (/_attributes]/.test(element.attr('name'))) {
          var name = element.attr('name').match(/\[\w+_attributes]/g).pop().match(/\[(\w+)_attributes]/).pop();
          name += /(\[\w+])$/.exec(element.attr('name'))[1];
        } else {
          var name = element.attr('name');
        }
        data[name] = element.val();

        var response = $.ajax({
          url: '/validators/uniqueness.json',
          data: data,
          async: false
        }).responseText;
        if (!$.parseJSON(response)) {
          return validator.message;
        }
      }
    }
  }

  this.remoteValidators = ['uniqueness'];

  this.elementValidateAfter  = function(element, eventData) {};
  this.elementValidateBefore = function(element, eventData) {};
  this.elementValidateFail   = function(element, message, eventData) {};
  this.elementValidatePass   = function(element, callback, eventData) { callback() };

  this.formValidateAfter  = function(form, eventData) {};
  this.formValidateBefore = function(form, eventData) {};
  this.formValidateFail   = function(form, eventData) {};
  this.formValidatePass   = function(form, eventData) {};
}


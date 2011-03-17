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

    // Find first version of IE where reapplySelectionAndFocus works
    var userAgent = $.browser;
    if (!userAgent.msie) {
      $('[data-validators][data-failed-once]').live('keyup', function() {
        if (this.type != 'checkbox') {
          clientSideValidations.validateSelector(this, this.selectionStart, this.selectionEnd);
        }
      });
    }

    $('[id*=_confirmation]').each(function() {
      if (relatedElement = document.getElementById((this.id.match(/(.+)_confirmation/)[1]))) {
        $('#'+this.id).live('keyup', function() {
          clientSideValidations.validateSelector(relatedElement);
        });
      }
    });

    $('[data-validators]').live('blur', function() {
      clientSideValidations.validateSelector(this);
    });

    $('[id*=_confirmation]').each(function() {
      if (relatedElement = document.getElementById((this.id.match(/(.+)_confirmation/)[1]))) {
        $('#'+this.id).live('blur', function() {
          clientSideValidations.validateSelector(relatedElement);
        });
      }
    });

    $('[data-validators][type="checkbox"]').live('click', function() {
      clientSideValidations.validateSelector(this, 'checkbox');
    });
  }

  this.validateForm = function(form) {
    var validForm = true;

    for (var i = 0, selector; selector = $(form).find('[data-validators]')[i]; i++) {
      if (!this.validateSelector(selector)) { validForm = false }
    }

    return validForm;
  }

  this.validateSelector = function(selector, selectionStart, selectionEnd) {
    var selector = $(selector);
    var validSelector = true;
    var validators = new Function("return " + selector.attr('data-validators'))();
    this.detachErrorField(selector, selectionStart, selectionEnd);

    for (var key in validators) {
      if (this.validator[key] && (message = this.validator[key](validators[key], selector))) {
        this.applyErrorField(selector, message, selectionStart, selectionEnd);
        validSelector = false;
        break;
      }
    }

    return validSelector;
  }

  this.detachErrorField = function(selector, selectionStart, selectionEnd) {
    var settings = window[selector.closest('form').attr('id')];
    this['detach' + settings.type + 'ErrorField'](selector, selectionStart, selectionEnd, settings);
  }

  this['detachActionView::Helpers::FormBuilderErrorField'] = function(selector, selectionStart, selectionEnd, settings) {
    var errorFieldClass = $(settings.input_tag).attr('class');
    var inputErrorField = selector.closest('.' + errorFieldClass);
    var label = $('label[for="' + selector.attr('id') + '"]:not(.message)');
    var labelErrorField = label.closest('.' + errorFieldClass);

    if (inputErrorField[0]) {
      $('[data-validators]').die('blur');
      inputErrorField.find('#' + selector.attr('id')).detach();
      inputErrorField.replaceWith(selector);
      $('[data-validators]').live('blur', function() { clientSideValidations.validateSelector(this) });
      this.reapplySelectionAndFocus(selector, selectionStart, selectionEnd);
      label.detach();
      labelErrorField.replaceWith(label);
    }
  }

  this['detachSimpleForm::FormBuilderErrorField'] = function(selector, selectionStart, selectionEnd, settings) {
    var wrapper = selector.closest(settings.wrapper_tag + '.' + settings.wrapper_error_class);
    wrapper.removeClass(settings.wrapper_error_class);
    var errorElement = wrapper.find(settings.error_tag + '.' + settings.error_class);
    errorElement.remove();
  }

  this['detachFormtastic::SemanticFormBuilderErrorField'] = function(selector, selectionStart, selectionEnd, settings) {
    var wrapper = selector.closest('li.error');
    wrapper.removeClass('error');
    var errorElement = wrapper.find('p.' + settings.inline_error_class);
    errorElement.remove();
  }

  this.applyErrorField = function(selector, message, selectionStart, selectionEnd) {
    selector.attr('data-failed-once', true);
    var settings = window[selector.closest('form').attr('id')];
    this['apply' + settings.type + 'ErrorField'](selector, message, selectionStart, selectionEnd, settings);
  }

  this['applyActionView::Helpers::FormBuilderErrorField'] = function(selector, message, selectionStart, selectionEnd, settings) {
    var inputErrorField = $(settings.input_tag);
    var labelErrorField = $(settings.label_tag);
    var label = $('label[for="' + selector.attr('id') + '"]:not(.message)');

    // Killing the live event then re-enabling them is probably not very performant
    $('[data-validators]').die('blur');
    selector.replaceWith(inputErrorField);
    inputErrorField.find('span#input_tag').replaceWith(selector);
    inputErrorField.find('label.message').text(message);
    inputErrorField.find('label.message').attr('for', selector.attr('id'));
    label.replaceWith(labelErrorField);
    labelErrorField.find('label#label_tag').replaceWith(label);

    $('[data-validators]').live('blur', function() { clientSideValidations.validateSelector(this) });
    this.reapplySelectionAndFocus(selector, selectionStart, selectionEnd);
  }

  this['applySimpleForm::FormBuilderErrorField'] = function(selector, message, selectionStart, selectionEnd, settings) {
    var wrapper = selector.closest(settings.wrapper_tag);
    wrapper.addClass(settings.wrapper_error_class);
    var errorElement = $('<' + settings.error_tag + ' class="' + settings.error_class + '">' + message + '</' + settings.error_tag + '>');
    wrapper.append(errorElement);
  }

  this['applyFormtastic::SemanticFormBuilderErrorField'] = function(selector, message, selectionStart, selectionEnd, settings) {
    var wrapper = selector.closest('li');
    wrapper.addClass('error');
    var errorElement = $('<p class="' + settings.inline_error_class + '">' + message + '</p>');
    wrapper.append(errorElement);
  }

  this.validator = {
    acceptance: function(validator, selector) {
      switch (selector.attr('type')) {
        case 'checkbox':
          if (!selector.attr('checked')) {
            return validator.message;
          }
          break;
        case 'text':
          if (selector.val() != (validator.accept || '1')) {
            return validator.message;
          }
          break;
      }
    },
    format: function(validator, selector) {
      if ((message = this.presence(validator, selector)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        if (validator['with'] && !validator['with'].test(selector.val())) {
          return validator.message;
        } else if (validator['without'] && validator['without'].test(selector.val())) {
          return validator.message;
        }
      }
    },
    presence: function(validator, selector) {
      if (/^\s*$/.test(selector.val())) {
        return validator.message;
      }
    },
    numericality: function(validator, selector) {
      if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(selector.val())) {
        return validator.messages.numericality;
      }

      if (validator.only_integer && !/^\d+$/.test(selector.val())) {
        return validator.messages.only_integer;
      }

      var CHECKS = { greater_than: '>', greater_than_or_equal_to: '>=',
        equal_to: '==', less_than: '<', less_than_or_equal_to: '<=' }

      for (var check in CHECKS) {
        if (validator[check] && !(new Function("return " + selector.val() + CHECKS[check] + validator[check])())) {
          return validator.messages[check];
        }
      }

      if (validator.odd && !(parseInt(selector.val()) % 2)) {
        return validator.messages.odd;
      }

      if (validator.even && (parseInt(selector.val()) % 2)) {
        return validator.messages.even;
      }
    },
    length: function(validator, selector) {
      var blank_validator = {};
      if (validator.is) {
        blank_validator.message = validator.messages.is;
      } else if (validator.minimum) {
        blank_validator.message = validator.messages.minimum;
      }
      if ((message = this.presence(blank_validator, selector)) && validator.allow_blank == true && !validator.maximum) {
        return;
      } else if (message) {
        return message;
      } else {
        var CHECKS = { is: '==', minimum: '>=', maximum: '<=' }
        var tokenizer = validator.js_tokenizer || "split('')";
        var tokenized_length = new Function("selector", "return (selector.val()." + tokenizer + " || '').length;")(selector);

        for (var check in CHECKS) {
          if (validator[check] && !(new Function("return " + tokenized_length + CHECKS[check] + validator[check])())) {
            return validator.messages[check];
          }
        }
      }
    },
    confirmation: function(validator, selector) {
      if (selector.val() != $('#' + selector.attr('id') + '_confirmation').val()) {
        return validator.message;
      }
    },
    exclusion: function(validator, selector) {
      if ((message = this.presence(validator, selector)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        for (var i = 0; i < validator['in'].length; i++) {
          if (validator['in'][i] == selector.val()) {
            return validator.message;
          }
        }
      }
    },
    inclusion: function(validator, selector) {
      if ((message = this.presence(validator, selector)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        for (var i = 0; i < validator['in'].length; i++) {
          if (validator['in'][i] == selector.val()) {
            return;
          }
        }
        return validator.message;
      }
    },
    uniqueness: function(validator, selector) {
      if ((message = this.presence(validator, selector)) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        var data = {};
        data['case_sensitive'] = !!validator.case_sensitive;
        if (validator.id) {
          data['id'] = validator.id;
        }

        // Kind of a hack but this will isolate the resource name and attribute.
        // e.g. user[records_attributes][0][title] => records[title]
        // e.g. user[record_attributes][title] => record[title]
        // Server side handles classifying the resource properly
        if (/_attributes]/.test(selector.attr('name'))) {
          var name = selector.attr('name').match(/\[\w+_attributes]/g).pop().match(/\[(\w+)_attributes]/).pop();
          name += /(\[\w+])$/.exec(selector.attr('name'))[1];
        } else {
          var name = selector.attr('name');
        }
        data[name] = selector.val();

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

  this.reapplySelectionAndFocus = function(selector, selectionStart, selectionEnd) {
    if (selectionStart != undefined && selectionEnd != undefined) {
      selector[0].setSelectionRange(selectionStart, selectionEnd);
      selector[0].focus();
    } else if (selectionStart == 'checkbox') {
      selector[0].focus();
    }
  }
}


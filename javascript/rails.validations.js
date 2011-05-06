/*
 Rails 3 Client Side Validations - v3.0.4
 https://github.com/bcardarlela/client_side_validations

 Copyright (c) 2011 Brian Cardarella
 Licensed under the MIT license
 http://www.opensource.org/licenses/mit-license.php

  CoffeeScript Version is by Amr Numan Tamimi
*/var clientSideValidations;
(function($) {
  var validateElement, validateForm;
  $.fn.validate = function() {
    return this.filter('form[data-validate]').each(function() {
      var addError, form, removeError, settings;
      form = $(this);
      settings = window[form.attr('id')];
      form.submit(function() {
        return form.isValid(settings.validators);
      }).bind('ajax:beforeSend', function() {
        return form.isValid(settings.validators);
      }).bind('form:validate:after', function(eventData) {
        return clientSideValidations.callbacks.form.after(form, eventData);
      }).bind('form:validate:before', function(eventData) {
        return clientSideValidations.callbacks.form.before(form, eventData);
      }).bind('form:validate:fail', function(eventData) {
        return clientSideValidations.callbacks.form.fail(form, eventData);
      }).bind('form:validate:pass', function(eventData) {
        return clientSideValidations.callbacks.form.pass(form, eventData);
      }).find('[data-validate]:input').live('focusout', function() {
        return $(this).isValid(settings.validators);
      }).live('change', function() {
        return $(this).data('changed', true);
      }).live('element:validate:after', function(eventData) {
        return clientSideValidations.callbacks.element.after($(this), eventData);
      }).live('element:validate:before', function(eventData) {
        return clientSideValidations.callbacks.element.before($(this), eventData);
      }).live('element:validate:fail', function(eventData, message) {
        var element;
        element = $(this);
        return clientSideValidations.callbacks.element.fail(element, message, (function() {
          return addError(element, message);
        }), eventData);
      }).live('element:validate:pass', function(eventData) {
        var element;
        element = $(this);
        return clientSideValidations.callbacks.element.pass(element, (function() {
          return removeError(element);
        }), eventData);
      }).end().find('[data-validate]:checkbox').live('click', function() {
        return $(this).isValid(settings.validators);
      }).end().find('[id*=_confirmation]').each(function() {
        var confirmationElement, element;
        confirmationElement = $(this);
        element = form.find("#" + (this.id.match(/(.+)_confirmation/)[1]) + "[data-validate]:input");
        if (element[0]) {
          return $("#" + (confirmationElement.attr('id'))).live('focusout', function() {
            return element.data('changed', true).isValid(settings.validators);
          }).live('keyup', function() {
            return element.data('changed', true).isValid(settings.validators);
          });
        }
      });
      addError = function(element, message) {
        return clientSideValidations.formBuilders[settings.type].add(element, settings, message);
      };
      return removeError = function(element) {
        return clientSideValidations.formBuilders[settings.type].remove(element, settings);
      };
    });
  };
  $.fn.isValid = function(validators) {
    if ($(this[0]).is('form')) {
      return validateForm($(this[0]), validators);
    } else {
      return validateElement($(this[0]), validators[this[0].name]);
    }
  };
  validateForm = function(form, validators) {
    var valid;
    valid = true;
    form.trigger('form:validate:before').find('[data-validate]:input').each(function() {
      if (!$(this).isValid(validators)) {
        return valid = false;
      }
    });
    if (valid) {
      form.trigger('form:validate:pass');
    } else {
      form.trigger('form:validate:fail');
    }
    form.trigger('form:validate:after');
    return valid;
  };
  validateElement = function(element, validators) {
    var kind, message, valid;
    element.trigger('element:validate:before');
    if (element.data('changed') !== false) {
      valid = true;
      element.data('changed', false);
      /*
            Because 'length' is defined on the list of validators we cannot call jQuery.each on
            the clientSideValidations.validators.all() object
            */
      for (kind in clientSideValidations.validators.all()) {
        if (validators[kind] && (message = clientSideValidations.validators.all()[kind](element, validators[kind]))) {
          element.trigger('element:validate:fail', message).data('valid', false);
          valid = false;
          break;
        }
      }
      if (valid) {
        element.data('valid', null);
        element.trigger('element:validate:pass');
      }
    }
    element.trigger('element:validate:after');
    if (element.data('valid') === false) {
      return false;
    } else {
      return true;
    }
  };
  return $(function() {
    return $('form[data-validate]').validate();
  });
})(jQuery);
clientSideValidations = {
  validators: {
    all: function() {
      return jQuery.extend({}, clientSideValidations.validators.local, clientSideValidations.validators.remote);
    },
    local: {
      presence: function(element, options) {
        if (/^\s*$/.test(element.val())) {
          return options.message;
        }
      },
      acceptance: function(element, options) {
        switch (element.attr('type')) {
          case 'checkbox':
            if (!element.attr('checked')) {
              return options.message;
            }
            break;
          case 'text':
            if ((element.val() !== (options.accept || '1'))) {
              return options.message;
            }
            break;
        }
      },
      format: function(element, options) {
        var message;
        if ((message = this.presence(element, options)) && options.allow_blank === true) {
          ;
        } else if (message) {
          return message;
        } else {
          if (options['with'] && !options['with'].test(element.val())) {
            return options.message;
          } else if (options['without'] && options['without'].test(element.val())) {
            return options.message;
          }
        }
      },
      numericality: function(element, options) {
        var CHECKS, check;
        if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(element.val())) {
          return options.messages.numericality;
        }
        if (options.only_integer && !/^\d+$/.test(element.val())) {
          return options.messages.only_integer;
        }
        CHECKS = {
          greater_than: '>',
          greater_than_or_equal_to: '>=',
          equal_to: '==',
          less_than: '<',
          less_than_or_equal_to: '<='
        };
        for (check in CHECKS) {
          if (options[check] && !(new Function("return " + element.val() + CHECKS[check] + options[check])())) {
            return options.messages[check];
          }
        }
        if (options.odd && !(parseInt(element.val()) % 2)) {
          return options.messages.odd;
        }
        if (options.even && (parseInt(element.val()) % 2)) {
          return options.messages.even;
        }
      },
      length: function(element, options) {
        var CHECKS, blankOptions, check, message, tokenized_length, tokenizer;
        blankOptions = {};
        if (options.is) {
          blankOptions.message = options.messages.is;
        } else if (options.minimum) {
          blankOptions.message = options.messages.minimum;
        }
        if ((message = this.presence(element, blankOptions)) && options.allow_blank === true && !options.maximum) {
          ;
        } else if (message) {
          return message;
        } else {
          CHECKS = {
            is: '==',
            minimum: '>=',
            maximum: '<='
          };
          tokenizer = options.js_tokenizer || "split('')";
          tokenized_length = new Function("element", "return (element.val()." + tokenizer + " || '').length;")(element);
          for (check in CHECKS) {
            if (options[check] && !(new Function("return " + tokenized_length + CHECKS[check] + options[check])())) {
              return options.messages[check];
            }
          }
        }
      },
      exclusion: function(element, options) {
        var i, lower, message, upper, _ref;
        if ((message = this.presence(element, options)) && options.allow_blank === true) {
          ;
        } else if (message) {
          return message;
        } else {
          if (options['in']) {
            for (i = 0, _ref = options['in'].length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              if (options['in'][i] === element.val()) {
                return options.message;
              }
            }
          } else if (options['range']) {
            lower = options['range'][0];
            upper = options['range'][1];
            if (element.val() >= lower && element.val() <= upper) {
              return options.message;
            }
          }
        }
      },
      inclusion: function(element, options) {
        var i, lower, message, upper, _ref;
        if ((message = this.presence(element, options)) && options.allow_blank === true) {
          ;
        } else if (message) {
          return message;
        } else {
          if (options['in']) {
            for (i = 0, _ref = options['in'].length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              if (options['in'][i] === element.val()) {
                return;
              }
            }
            return options.message;
          } else if (options['range']) {
            lower = options['range'][0];
            upper = options['range'][1];
            if (element.val() >= lower && element.val() <= upper) {
              ;
            } else {
              return options.message;
            }
          }
        }
      },
      confirmation: function(element, options) {
        if (element.val() !== jQuery("#" + (element.attr('id')) + "_confirmation").val()) {
          return options.message;
        }
      }
    },
    remote: {
      uniqueness: function(element, options) {
        var data, key, name, scoped_element;
        data = {};
        data['case_sensitive'] = !!options.case_sensitive;
        if (options.id) {
          data['id'] = options.id;
        }
        if (options.scope) {
          data.scope = {};
          for (key in options.scope) {
            scoped_element = jQuery('[name="' + element.attr('name').replace(/\[\w+]$/, '[' + key + ']' + '"]'));
            if (scoped_element[0] && scoped_element.val() !== options.scope[key]) {
              data.scope[key] = scoped_element.val();
              scoped_element.unbind("change." + element.i).bind("change." + element.id, function() {
                element.trigger('change');
                return element.trigger('focusout');
              });
            } else {
              data.scope[key] = options.scope[key];
            }
          }
        }
        /*
                Kind of a hack but this will isolate the resource name and attribute.
                e.g. user[records_attributes][0][title] => records[title]
                e.g. user[record_attributes][title] => record[title]
                Server side handles classifying the resource properly
                */
        if (/_attributes]/.test(element.attr('name'))) {
          name = element.attr('name').match(/\[\w+_attributes]/g).pop().match(/\[(\w+)_attributes]/).pop();
          name += /(\[\w+])$/.exec(element.attr('name'))[1];
        } else {
          name = element.attr('name');
        }
        data[name] = element.val();
        if (jQuery.ajax({
          url: '/validators/uniqueness.json',
          data: data,
          async: false
        }).status === 200) {
          return options.message;
        }
      }
    }
  },
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: function(element, settings, message) {
        var inputErrorField, label, labelErrorField;
        if (element.data('valid') !== false) {
          inputErrorField = jQuery(settings.input_tag);
          labelErrorField = jQuery(settings.label_tag);
          label = jQuery('label[for="' + element.attr('id') + '"]:not(.message)');
          if (element.attr('autofocus')) {
            element.attr('autofocus', false);
          }
          element.before(inputErrorField);
          inputErrorField.find('span#input_tag').replaceWith(element);
          inputErrorField.find('label.message').attr('for', element.attr('id'));
          labelErrorField.find('label.message').attr('for', element.attr('id'));
          label.replaceWith(labelErrorField);
          labelErrorField.find('label#label_tag').replaceWith(label);
        }
        jQuery('label.message[for="' + element.attr('id') + '"]').text(message);
      },
      remove: function(element, settings) {
        var errorFieldClass, inputErrorField, label, labelErrorField;
        errorFieldClass = jQuery(settings.input_tag).attr('class');
        inputErrorField = element.closest('.' + errorFieldClass);
        label = jQuery('label[for="' + element.attr('id') + '"]:not(.message)');
        labelErrorField = label.closest('.' + errorFieldClass);
        if (inputErrorField[0]) {
                    inputErrorField.find('#' + element.attr('id')).detach();
          inputErrorField.replaceWith(element);
          label.detach();
          labelErrorField.replaceWith(label);;
        }
      }
    },
    'SimpleForm::FormBuilder': {
      add: function(element, settings, message) {
        var errorElement, wrapper;
        if (element.data('valid') !== false) {
                    wrapper = element.closest(settings.wrapper_tag);
          wrapper.addClass(settings.wrapper_error_class);
          errorElement = $('<' + settings.error_tag + ' class="' + settings.error_class + '">' + message + '</' + settings.error_tag + '>');
          wrapper.append(errorElement);;
        } else {
          element.parent().find(settings.error_tag + '.' + settings.error_class).text(message);
        }
      },
      remove: function(element, settings) {
        var errorElement, wrapper;
        wrapper = element.closest(settings.wrapper_tag + '.' + settings.wrapper_error_class);
        wrapper.removeClass(settings.wrapper_error_class);
        errorElement = wrapper.find(settings.error_tag + '.' + settings.error_class);
        errorElement.remove();
      }
    },
    'Formtastic::SemanticFormBuilder': {
      add: function(element, settings, message) {
        var errorElement, wrapper;
        if (element.data('valid') !== false) {
                    wrapper = element.closest('li');
          wrapper.addClass('error');
          errorElement = $('<p class="' + settings.inline_error_class + '">' + message + '</p>');
          wrapper.append(errorElement);;
        } else {
          element.parent().find('p.' + settings.inline_error_class).text(message);
        }
      },
      remove: function(element, settings) {
        var errorElement, wrapper;
        wrapper = element.closest('li.error');
        wrapper.removeClass('error');
        errorElement = wrapper.find('p.' + settings.inline_error_class);
        errorElement.remove();
      }
    }
  },
  callbacks: {
    element: {
      after: function(element, eventData) {},
      before: function(element, eventData) {},
      fail: function(element, message, addError, eventData) {
        return addError();
      },
      pass: function(element, removeError, eventData) {
        return removeError();
      }
    },
    form: {
      after: function(form, eventData) {},
      before: function(form, eventData) {},
      fail: function(form, eventData) {},
      pass: function(form, eventData) {}
    }
  }
};

/*
  Rails 3 Client Side Validations - v3.2.0.beta.2
  https://github.com/bcardarella/client_side_validations

  Copyright (c) 2012 Brian Cardarella
  Licensed under the MIT license
  http://www.opensource.org/licenses/mit-license.php
*/

(function() {
  var $, validateElement, validateForm;

  $ = jQuery;

  $.fn.validate = function() {
    return this.filter('form[data-validate]').each(function() {
      var addError, form, removeError, settings;
      form = $(this);
      settings = window['ClientSideValidations']['forms'][form.attr('id')];
      addError = function(element, message) {
        return ClientSideValidations.formBuilders[settings.type].add(element, settings, message);
      };
      removeError = function(element) {
        return ClientSideValidations.formBuilders[settings.type].remove(element, settings);
      };
      return form.submit(function() {
        return form.isValid(settings.validators);
      }).bind('ajax:beforeSend', function(eventData) {
        if (eventData.target === this) return form.isValid(settings.validators);
      }).bind('form:validate:after', function(eventData) {
        return ClientSideValidations.callbacks.form.after(form, eventData);
      }).bind('form:validate:before', function(eventData) {
        return ClientSideValidations.callbacks.form.before(form, eventData);
      }).bind('form:validate:fail', function(eventData) {
        return ClientSideValidations.callbacks.form.fail(form, eventData);
      }).bind('form:validate:pass', function(eventData) {
        return ClientSideValidations.callbacks.form.pass(form, eventData);
      }).find('[data-validate="true"]:input:enabled:not(:radio)').live('focusout', function() {
        return $(this).isValid(settings.validators);
      }).live('change', function() {
        return $(this).data('changed', true);
      }).live('element:validate:after', function(eventData) {
        return ClientSideValidations.callbacks.element.after($(this), eventData);
      }).live('element:validate:before', function(eventData) {
        return ClientSideValidations.callbacks.element.before($(this), eventData);
      }).live('element:validate:fail', function(eventData, message) {
        var element;
        element = $(this);
        return ClientSideValidations.callbacks.element.fail(element, message, function() {
          return addError(element, message);
        }, eventData);
      }).live('element:validate:pass', function(eventData, message) {
        var element;
        element = $(this);
        return ClientSideValidations.callbacks.element.pass(element, function() {
          return removeError(element);
        }, eventData);
      }).end().find('[data-validate="true"]:checkbox').live('click', function() {
        return $(this).isValid(settings.validators);
      }).end().find('[id*=_confirmation]').each(function() {
        var confirmationElement, element;
        confirmationElement = $(this);
        element = form.find("#" + (this.id.match(/(.+)_confirmation/)[1]) + "[data-validate='true']:input");
        if (element[0]) {
          return $("#" + (confirmationElement.attr('id'))).live('focusout', function() {
            return element.data('changed', true).isValid(settings.validators);
          }).live('keyup', function() {
            return element.data('changed', true).isValid(settings.validators);
          });
        }
      });
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
    form.trigger('form:validate:before').find('[data-validate="true"]:input:enabled').each(function() {
      if (!$(this).isValid(validators)) valid = false;
      if (valid) {
        form.trigger('form:validate:pass');
      } else {
        form.trigger('form:validate:fail');
      }
      return form.trigger('form:validate:after');
    });
    return valid;
  };

  validateElement = function(element, validators) {
    var kind, message, valid;
    element.trigger('element:validate:before');
    if (element.data('changed') !== false) {
      valid = true;
      element.data('changed', false);
      for (kind in ClientSideValidations.validators.local) {
        if (validators[kind] && (message = ClientSideValidations.validators.all()[kind](element, validators[kind]))) {
          element.trigger('element:validate:fail', message).data('valid', false);
          valid = false;
          break;
        }
      }
      if (valid) {
        for (kind in ClientSideValidations.validators.remote) {
          if (validators[kind] && (message = ClientSideValidations.validators.all()[kind](element, validators[kind]))) {
            element.trigger('element:validate:fail', message).data('valid', false);
            valid = false;
            break;
          }
        }
      }
      if (valid) {
        element.data('valid', null);
        element.trigger('element:validate:pass');
      }
      element.trigger('element:validate:after');
      if (element.data('valid') === false) {
        return false;
      } else {
        return true;
      }
    }
  };

  $(function() {
    return $('form[data-validate]').validate();
  });

  window.ClientSideValidations = {
    forms: {},
    validators: {
      all: function() {
        return $.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote);
      },
      local: {
        presence: function(element, options) {
          if (/^\s*$/.test(element.val() || "")) return options.message;
        },
        acceptance: function(element, options) {
          switch (element.attr('type')) {
            case 'checkbox':
              if (!element.attr('checked')) return options.message;
              break;
            case 'text':
              if (element.val() !== (options.accept || '1').toString()) {
                return options.message;
              }
          }
        },
        format: function(element, options) {
          var message;
          if ((message = this.presence(element, options)) && options.allow_blank === true) {} else if (message) {
            return message;
          } else {
            if (options['with'] && !options['with'].test(element.val())) {
              return options.message;
            }
          }
        },
        numericality: function(element, options) {
          var CHECKS, check;
          if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(element.val())) {
            return options.messages.numericality;
          }
          if (options.only_integer && !/^[+-]?\d+$/.test(element.val())) {
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
            if (options[check] !== void 0 && !(new Function("return " + element.val() + CHECKS[check] + options[check])())) {
              return options.messages[check];
            }
          }
          if (options.odd && !(parseInt(element.val(), 10) % 2)) {
            return options.messages.odd;
          }
          if (options.even && (parseInt(element.val(), 10) % 2)) {
            return options.messages.even;
          }
        },
        length: function(element, options) {
          var CHECKS, blankOptions, check, message, tokenized_length, tokenizer;
          blankOptions = {};
          CHECKS = {
            is: '==',
            minimum: '>=',
            maximum: '<='
          };
          tokenizer = options.js_tokenizer || "split('')";
          tokenized_length = new Function("element", "return (element.val()." + tokenizer + " || '').length;")(element);
          if (options.is) {
            blankOptions.message = options.messages.is;
          } else if (options.minimum) {
            blankOptions.message = options.messages.minimum;
          }
          if ((message = this.presence(element, blankOptions)) && options.allow_blank === true) {} else if (message) {
            return message;
          } else {
            for (check in CHECKS) {
              if (options[check] && !(new Function("return " + tokenized_length + CHECKS[check] + options[check])())) {
                return options.messages[check];
              }
            }
          }
        },
        exclusion: function(element, options) {
          var lower, message, upper, value;
          lower = null;
          upper = null;
          if ((message = this.presence(element, options)) && options.allow_blank === true) {} else if (message) {
            return message;
          } else {
            if (options['in']) {
              for (value in options['in']) {
                if (value.toString() === element.val()) return options.message;
              }
            } else if (options.range) {
              lower = options.range[0];
              upper = options.range[1];
              if (element.val() >= lower && element.val() <= upper) {
                return options.message;
              }
            }
          }
        },
        inclusion: function(element, options) {
          var lower, message, upper, value;
          lower = null;
          upper = null;
          if ((message = this.presence(element, options)) && options.allow_blank === true) {} else if (message) {
            return message;
          } else {
            if (options['in']) {
              for (value in options['in']) {
                if (value.toString() === element.val()) return;
              }
              return options.message;
            } else if (options.range) {
              lower = options.range[0];
              upper = options.range[1];
              if (element.val() >= lower && element.val() <= upper) {} else {
                return options.message;
              }
            }
          }
        },
        confirmation: function(element, options) {
          if (element.val() !== $("#" + (element.attr('id')) + "_confirmation").val()) {
            return options.message;
          }
        }
      },
      remote: {
        uniqueness: function(element, options) {
          var data, key, message, name, scoped_element;
          if ((message = ClientSideValidations.validators.local.presence(element, options)) && options.allow_blank === true) {} else if (message) {
            return message;
          } else {
            data = {};
            name = null;
            data.case_sensitive = !!options.case_sensitive;
            if (options.id) data.id = options.id;
            if (options.scope) {
              data.scope = {};
              for (key in options.scope) {
                scoped_element = $('[name="' + element.attr('name').replace(/\[\w+\]$/, '[' + key + ']' + '"]'));
                if (scoped_element[0] && scoped_element.val() !== options.scope[key]) {
                  data.scope[key] = scoped_element.val();
                  scoped_element.unbind("change." + element.id).bind("change." + element.id, function() {
                    element.trigger('change');
                    return element.trigger('focusout');
                  });
                } else {
                  data.scope[key] = options.scope[key];
                }
              }
            }
            if (/_attributes\]/.test(element.attr('name'))) {
              name = element.attr('name').match(/\[\w+_attributes\]/g).pop().match(/\[(\w+)_attributes\]/).pop();
              name += /(\[\w+\])$/.exec(element.attr('name'))[1];
            } else {
              name = element.attr('name');
            }
            if (options['class']) {
              name = "" + options['class'] + "[" + (name.split('[')[1]);
            }
            data[name] = element.val();
            if ($.ajax({
              url: '/validators/uniqueness',
              data: data,
              async: false
            }).status === 200) {
              return options.message;
            }
          }
        }
      }
    },
    formBuilders: {
      'ActionView::Helpers::FormBuilder': {
        add: function(element, settings, message) {
          var inputErrorField, label, labelErrorField;
          if (element.data('valid') !== false && $("label.message[for='" + (element.attr('id')) + "']")[0] === void 0) {
            inputErrorField = $(settings.input_tag);
            labelErrorField = $(settings.label_tag);
            label = $("label[for='" + (element.attr('id')) + "']:not(.message)");
            if (element.attr('autofocus')) element.attr('autofocus', false);
            element.before(inputErrorField);
            inputErrorField.find('span#input_tag').replaceWith(element);
            inputErrorField.find('label.message').attr('for', element.attr('id'));
            labelErrorField.find('label.message').attr('for', element.attr('id'));
            label.replaceWith(labelErrorField);
            labelErrorField.find('label#label_tag').replaceWith(label);
          }
          return $("label.message[for='" + (element.attr('id')) + "']").text(message);
        },
        remove: function(element, settings) {
          var errorFieldClass, inputErrorField, label, labelErrorField;
          errorFieldClass = $(settings.input_tag).attr('class');
          inputErrorField = element.closest("." + errorFieldClass);
          label = $("label[for='" + (element.attr('id')) + "']:not(.message)");
          labelErrorField = label.closest("." + errorFieldClass);
          if (inputErrorField[0]) {
            inputErrorField.find("#" + (element.attr('id'))).detach();
            inputErrorField.replaceWith(element);
            label.detach();
            return labelErrorField.replaceWith(label);
          }
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

}).call(this);

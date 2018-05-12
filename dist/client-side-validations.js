/*!
 * Client Side Validations JS - v0.0.2 (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) 2019 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = global || self, global.clientSideValidations = factory(global.$));
}(this, function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var ClientSideValidations = {
    callbacks: {
      element: {
        after: function after(element, eventData) {},
        before: function before(element, eventData) {},
        fail: function fail(element, message, addError, eventData) {
          return addError();
        },
        pass: function pass(element, removeError, eventData) {
          return removeError();
        }
      },
      form: {
        after: function after(form, eventData) {},
        before: function before(form, eventData) {},
        fail: function fail(form, eventData) {},
        pass: function pass(form, eventData) {}
      }
    },
    enablers: {
      form: function form(_form) {
        var $form = $(_form);
        _form.ClientSideValidations = {
          settings: $form.data('clientSideValidations'),
          addError: function addError(element, message) {
            return ClientSideValidations.formBuilders[_form.ClientSideValidations.settings.html_settings.type].add(element, _form.ClientSideValidations.settings.html_settings, message);
          },
          removeError: function removeError(element) {
            return ClientSideValidations.formBuilders[_form.ClientSideValidations.settings.html_settings.type].remove(element, _form.ClientSideValidations.settings.html_settings);
          }
        };
        var ref = {
          'submit.ClientSideValidations': function submitClientSideValidations(eventData) {
            if (!$form.isValid(_form.ClientSideValidations.settings.validators)) {
              eventData.preventDefault();
              eventData.stopImmediatePropagation();
            }
          },
          'ajax:beforeSend.ClientSideValidations': function ajaxBeforeSendClientSideValidations(eventData) {
            if (eventData.target === this) {
              $form.isValid(_form.ClientSideValidations.settings.validators);
            }
          },
          'form:validate:after.ClientSideValidations': function formValidateAfterClientSideValidations(eventData) {
            ClientSideValidations.callbacks.form.after($form, eventData);
          },
          'form:validate:before.ClientSideValidations': function formValidateBeforeClientSideValidations(eventData) {
            ClientSideValidations.callbacks.form.before($form, eventData);
          },
          'form:validate:fail.ClientSideValidations': function formValidateFailClientSideValidations(eventData) {
            ClientSideValidations.callbacks.form.fail($form, eventData);
          },
          'form:validate:pass.ClientSideValidations': function formValidatePassClientSideValidations(eventData) {
            ClientSideValidations.callbacks.form.pass($form, eventData);
          }
        };

        for (var event in ref) {
          var binding = ref[event];
          $form.on(event, binding);
        }

        return $form.find(ClientSideValidations.selectors.inputs).each(function () {
          return ClientSideValidations.enablers.input(this);
        });
      },
      input: function input(_input) {
        var $input = $(_input);
        var form = _input.form;
        var $form = $(form);
        var ref = {
          'focusout.ClientSideValidations': function focusoutClientSideValidations() {
            $(this).isValid(form.ClientSideValidations.settings.validators);
          },
          'change.ClientSideValidations': function changeClientSideValidations() {
            $(this).data('changed', true);
          },
          'element:validate:after.ClientSideValidations': function elementValidateAfterClientSideValidations(eventData) {
            ClientSideValidations.callbacks.element.after($(this), eventData);
          },
          'element:validate:before.ClientSideValidations': function elementValidateBeforeClientSideValidations(eventData) {
            ClientSideValidations.callbacks.element.before($(this), eventData);
          },
          'element:validate:fail.ClientSideValidations': function elementValidateFailClientSideValidations(eventData, message) {
            var $element = $(this);
            ClientSideValidations.callbacks.element.fail($element, message, function () {
              return form.ClientSideValidations.addError($element, message);
            }, eventData);
          },
          'element:validate:pass.ClientSideValidations': function elementValidatePassClientSideValidations(eventData) {
            var $element = $(this);
            ClientSideValidations.callbacks.element.pass($element, function () {
              return form.ClientSideValidations.removeError($element);
            }, eventData);
          }
        };

        for (var event in ref) {
          var binding = ref[event];
          $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
            return $(this).attr('data-validate', true);
          }).on(event, binding);
        }

        $input.filter(':checkbox').on('change.ClientSideValidations', function () {
          $(this).isValid(form.ClientSideValidations.settings.validators);
        });
        return $input.filter('[id$=_confirmation]').each(function () {
          var confirmationElement = $(this);
          var element = $form.find('#' + this.id.match(/(.+)_confirmation/)[1] + ':input');

          if (element[0]) {
            var ref1 = {
              'focusout.ClientSideValidations': function focusoutClientSideValidations() {
                element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
              },
              'keyup.ClientSideValidations': function keyupClientSideValidations() {
                element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
              }
            };
            var results = [];

            for (var _event in ref1) {
              var _binding = ref1[_event];
              results.push($('#' + confirmationElement.attr('id')).on(_event, _binding));
            }

            return results;
          }
        });
      }
    },
    formBuilders: {
      'ActionView::Helpers::FormBuilder': {
        add: function add(element, settings, message) {
          var form = $(element[0].form);

          if (element.data('valid') !== false && form.find("label.message[for='" + element.attr('id') + "']")[0] == null) {
            var inputErrorField = $(settings.input_tag);
            var labelErrorField = $(settings.label_tag);
            var label = form.find("label[for='" + element.attr('id') + "']:not(.message)");

            if (element.attr('autofocus')) {
              element.attr('autofocus', false);
            }

            element.before(inputErrorField);
            inputErrorField.find('span#input_tag').replaceWith(element);
            inputErrorField.find('label.message').attr('for', element.attr('id'));
            labelErrorField.find('label.message').attr('for', element.attr('id'));
            labelErrorField.insertAfter(label);
            labelErrorField.find('label#label_tag').replaceWith(label);
          }

          return form.find("label.message[for='" + element.attr('id') + "']").text(message);
        },
        remove: function remove(element, settings) {
          var form = $(element[0].form);
          var errorFieldClass = $(settings.input_tag).attr('class');
          var inputErrorField = element.closest('.' + errorFieldClass.replace(/ /g, '.'));
          var label = form.find("label[for='" + element.attr('id') + "']:not(.message)");
          var labelErrorField = label.closest('.' + errorFieldClass);

          if (inputErrorField[0]) {
            inputErrorField.find('#' + element.attr('id')).detach();
            inputErrorField.replaceWith(element);
            label.detach();
            return labelErrorField.replaceWith(label);
          }
        }
      }
    },
    patterns: {
      numericality: {
        "default": new RegExp('^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$'),
        only_integer: new RegExp('^[+-]?\\d+$')
      }
    },
    selectors: {
      inputs: ':input:not(button):not([type="submit"])[name]:visible:enabled',
      validate_inputs: ':input:enabled:visible[data-validate]',
      forms: 'form[data-client-side-validations]'
    },
    validators: {
      all: function all() {
        return $.extend({});
      },
      local: {},
      remote: {}
    },
    disable: function disable(target) {
      var $target = $(target);
      $target.off('.ClientSideValidations');

      if ($target.is('form')) {
        return ClientSideValidations.disable($target.find(':input'));
      } else {
        $target.removeData('valid');
        $target.removeData('changed');
        return $target.filter(':input').each(function () {
          return $(this).removeAttr('data-validate');
        });
      }
    },
    reset: function reset(form) {
      var $form = $(form);
      ClientSideValidations.disable(form);

      for (var key in form.ClientSideValidations.settings.validators) {
        form.ClientSideValidations.removeError($form.find("[name='" + key + "']"));
      }

      return ClientSideValidations.enablers.form(form);
    },
    start: function start() {
      if (window.Turbolinks != null && window.Turbolinks.supported) {
        var initializeOnEvent = window.Turbolinks.EVENTS != null ? 'page:change' : 'turbolinks:load';
        $(document).on(initializeOnEvent, function () {
          return $(ClientSideValidations.selectors.forms).validate();
        });
      } else {
        $(function () {
          return $(ClientSideValidations.selectors.forms).validate();
        });
      }
    }
  };

  var presenceValidator = function presenceValidator(element, options, presence) {
    if (/^\s*$/.test(element.val() || '') === !presence) {
      return options.message;
    }
  };

  var absenceLocalValidator = function absenceLocalValidator(element, options) {
    return presenceValidator(element, options, true);
  };
  var presenceLocalValidator = function presenceLocalValidator(element, options) {
    return presenceValidator(element, options, false);
  };

  var acceptanceLocalValidator = function acceptanceLocalValidator(element, options) {
    switch (element.attr('type')) {
      case 'checkbox':
        if (!element.prop('checked')) {
          return options.message;
        }

        break;

      case 'text':
        var ref = options.accept;

        if (element.val() !== ((ref != null ? ref.toString() : void 0) || '1')) {
          return options.message;
        }

    }
  };

  var formatLocalValidator = function formatLocalValidator(element, options) {
    var elementIsNotPresent = ClientSideValidations.validators.local.presence(element, options);

    if (elementIsNotPresent) {
      if (options.allow_blank === true) {
        return;
      }

      return elementIsNotPresent;
    }

    if (options["with"] && !new RegExp(options["with"].source, options["with"].options).test(element.val())) {
      return options.message;
    }

    if (options.without && new RegExp(options.without.source, options.without.options).test(element.val())) {
      return options.message;
    }
  };

  var NUMERICALITY_CHECKS = {
    greater_than: function greater_than(a, b) {
      return a > b;
    },
    greater_than_or_equal_to: function greater_than_or_equal_to(a, b) {
      return a >= b;
    },
    equal_to: function equal_to(a, b) {
      return a === b;
    },
    less_than: function less_than(a, b) {
      return a < b;
    },
    less_than_or_equal_to: function less_than_or_equal_to(a, b) {
      return a <= b;
    }
  };
  var numericalityLocalValidator = function numericalityLocalValidator(element, options) {
    if (options.allow_blank === true && ClientSideValidations.validators.local.presence(element, {
      message: options.messages.numericality
    })) {
      return;
    }

    var $form = $(element[0].form);
    var numberFormat = $form[0].ClientSideValidations.settings.number_format;
    var val = $.trim(element.val()).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.');

    if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(val)) {
      return options.messages.only_integer;
    }

    if (!ClientSideValidations.patterns.numericality['default'].test(val)) {
      return options.messages.numericality;
    }

    for (var check in NUMERICALITY_CHECKS) {
      if (options[check] == null) {
        continue;
      }

      var checkValue = !isNaN(parseFloat(options[check])) && isFinite(options[check]) ? options[check] : $form.find('[name*=' + options[check] + ']').length === 1 ? $form.find('[name*=' + options[check] + ']').val() : void 0;

      if (checkValue == null || checkValue === '') {
        return;
      }

      if (!NUMERICALITY_CHECKS[check](parseFloat(val), parseFloat(checkValue))) {
        return options.messages[check];
      }
    }

    if (options.odd && !(parseInt(val, 10) % 2)) {
      return options.messages.odd;
    }

    if (options.even && parseInt(val, 10) % 2) {
      return options.messages.even;
    }
  };

  var LENGTH_CHECKS = {
    is: function is(a, b) {
      return a === b;
    },
    minimum: function minimum(a, b) {
      return a >= b;
    },
    maximum: function maximum(a, b) {
      return a <= b;
    }
  };
  var lengthLocalValidator = function lengthLocalValidator(element, options) {
    var length = element.val().length;
    var blankOptions = {};
    blankOptions.message = options.is ? options.messages.is : options.minimum ? options.messages.minimum : void 0;
    var elementIsNotPresent = ClientSideValidations.validators.local.presence(element, blankOptions);

    if (elementIsNotPresent) {
      if (options.allow_blank === true) {
        return;
      }

      return elementIsNotPresent;
    }

    for (var check in LENGTH_CHECKS) {
      if (!options[check]) {
        continue;
      }

      if (!LENGTH_CHECKS[check](length, parseInt(options[check]))) {
        return options.messages[check];
      }
    }
  };

  var inclusionValidator = function inclusionValidator(element, options, inclusion) {
    var elementIsNotPresent = ClientSideValidations.validators.local.presence(element, options);

    if (elementIsNotPresent) {
      if (options.allow_blank === true) {
        return;
      }

      return elementIsNotPresent;
    }

    if (options["in"]) {
      var results = [];

      for (var i in options["in"]) {
        results.push(options["in"][i].toString());
      }

      if (results.indexOf(element.val()) >= 0 === !inclusion) {
        return options.message;
      }
    }

    if (options.range) {
      var lower = options.range[0];
      var upper = options.range[1];

      if ((element.val() >= lower && element.val() <= upper) === !inclusion) {
        return options.message;
      }
    }
  };

  var exclusionLocalValidator = function exclusionLocalValidator(element, options) {
    return inclusionValidator(element, options, false);
  };
  var inclusionLocalValidator = function inclusionLocalValidator(element, options) {
    return inclusionValidator(element, options, true);
  };

  var confirmationLocalValidator = function confirmationLocalValidator(element, options) {
    var value = element.val();
    var confirmationValue = $('#' + element.attr('id') + '_confirmation').val();

    if (!options.case_sensitive) {
      value = value.toLowerCase();
      confirmationValue = confirmationValue.toLowerCase();
    }

    if (value !== confirmationValue) {
      return options.message;
    }
  };

  var uniquenessLocalValidator = function uniquenessLocalValidator(element, options) {
    var name = element.attr('name');

    if (!/_attributes\]\[\d/.test(name)) {
      return;
    }

    var matches = name.match(/^(.+_attributes\])\[\d+\](.+)$/);
    var namePrefix = matches[1];
    var nameSuffix = matches[2];
    var value = element.val();

    if (!(namePrefix && nameSuffix)) {
      return;
    }

    var form = element.closest('form');
    var valid = true;
    form.find(':input[name^="' + namePrefix + '"][name$="' + nameSuffix + '"]').each(function () {
      var otherValue = $(this).val();

      if (!options.case_sensitive) {
        value = value.toLowerCase();
        otherValue = otherValue.toLowerCase();
      }

      if ($(this).attr('name') !== name) {
        if (otherValue === value) {
          valid = false;
          return $(this).data('notLocallyUnique', true);
        } else {
          if ($(this).data('notLocallyUnique')) {
            return $(this).removeData('notLocallyUnique').data('changed', true);
          }
        }
      }
    });

    if (!valid) {
      return options.message;
    }
  };

  ClientSideValidations.validators.local = {
    absence: absenceLocalValidator,
    presence: presenceLocalValidator,
    acceptance: acceptanceLocalValidator,
    format: formatLocalValidator,
    numericality: numericalityLocalValidator,
    length: lengthLocalValidator,
    inclusion: inclusionLocalValidator,
    exclusion: exclusionLocalValidator,
    confirmation: confirmationLocalValidator,
    uniqueness: uniquenessLocalValidator
  };

  $.fn.disableClientSideValidations = function () {
    ClientSideValidations.disable(this);
    return this;
  };

  $.fn.enableClientSideValidations = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      return ClientSideValidations.enablers.form(this);
    });
    this.filter(ClientSideValidations.selectors.inputs).each(function () {
      return ClientSideValidations.enablers.input(this);
    });
    return this;
  };

  $.fn.resetClientSideValidations = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      return ClientSideValidations.reset(this);
    });
    return this;
  };

  $.fn.validate = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      return $(this).enableClientSideValidations();
    });
    return this;
  };

  $.fn.isValid = function (validators) {
    var obj = $(this[0]);

    if (obj.is('form')) {
      return validateForm(obj, validators);
    } else {
      return validateElement(obj, validatorsFor(this[0].name, validators));
    }
  };

  var validatorsFor = function validatorsFor(name, validators) {
    if (Object.prototype.isPrototypeOf.call(validators, name)) {
      return validators[name];
    }

    name = name.replace(/\[(\w+_attributes)\]\[[\da-z_]+\](?=\[(?:\w+_attributes)\])/g, '[$1][]');
    var captures = name.match(/\[(\w+_attributes)\].*\[(\w+)\]$/);

    if (captures) {
      for (var validatorName in validators) {
        if (validatorName.match('\\[' + captures[1] + '\\].*\\[\\]\\[' + captures[2] + '\\]$')) {
          name = name.replace(/\[[\da-z_]+\]\[(\w+)\]$/g, '[][$1]');
        }
      }
    }

    return validators[name] || {};
  };

  var validateForm = function validateForm(form, validators) {
    var valid = true;
    form.trigger('form:validate:before.ClientSideValidations');
    form.find(ClientSideValidations.selectors.validate_inputs).each(function () {
      if (!$(this).isValid(validators)) {
        valid = false;
      }

      return true;
    });

    if (valid) {
      form.trigger('form:validate:pass.ClientSideValidations');
    } else {
      form.trigger('form:validate:fail.ClientSideValidations');
    }

    form.trigger('form:validate:after.ClientSideValidations');
    return valid;
  };

  var validateElement = function validateElement(element, validators) {
    element.trigger('element:validate:before.ClientSideValidations');

    var passElement = function passElement() {
      return element.trigger('element:validate:pass.ClientSideValidations').data('valid', null);
    };

    var failElement = function failElement(message) {
      element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false);
      return false;
    };

    var afterValidate = function afterValidate() {
      return element.trigger('element:validate:after.ClientSideValidations').data('valid') !== false;
    };

    var executeValidators = function executeValidators(context) {
      var valid = true;

      for (var validator in validators) {
        var fn = context[validator];

        if (!fn) {
          continue;
        }

        var ref = validators[validator];

        for (var i in ref) {
          var message = fn.call(context, element, ref[i]);

          if (message) {
            valid = failElement(message);
            break;
          }
        }

        if (!valid) {
          break;
        }
      }

      return valid;
    };

    if (element.attr('name').search(/\[([^\]]*?)\]$/) >= 0) {
      var destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]');

      if ($("input[name='" + destroyInputName + "']").val() === '1') {
        passElement();
        return afterValidate();
      }
    }

    if (element.data('changed') === false) {
      return afterValidate();
    }

    element.data('changed', false);

    if (executeValidators(ClientSideValidations.validators.local) && executeValidators(ClientSideValidations.validators.remote)) {
      passElement();
    }

    return afterValidate();
  };

  if (!window.ClientSideValidations) {
    window.ClientSideValidations = ClientSideValidations;

    if (!isAMD() && !isCommonJS()) {
      ClientSideValidations.start();
    }
  }

  function isAMD() {
    return typeof define === 'function' && define.amd; // eslint-disable-line no-undef
  }

  function isCommonJS() {
    return (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined'; // eslint-disable-line no-undef
  }

  var main = {
    ClientSideValidations: ClientSideValidations
  };

  return main;

}));

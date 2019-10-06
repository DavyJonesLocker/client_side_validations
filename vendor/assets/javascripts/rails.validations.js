/*!
 * Client Side Validations JS - v0.1.0 (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) 2019 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = global || self, global.ClientSideValidations = factory(global.$));
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
    eventsToBind: {
      form: function form(_form, $form) {
        return {
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
      },
      input: function input(form) {
        return {
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
      },
      inputConfirmation: function inputConfirmation(element, form) {
        return {
          'focusout.ClientSideValidations': function focusoutClientSideValidations() {
            element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
          },
          'keyup.ClientSideValidations': function keyupClientSideValidations() {
            element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
          }
        };
      }
    },
    enablers: {
      form: function form(_form2) {
        var $form = $(_form2);
        _form2.ClientSideValidations = {
          settings: $form.data('clientSideValidations'),
          addError: function addError(element, message) {
            return ClientSideValidations.formBuilders[_form2.ClientSideValidations.settings.html_settings.type].add(element, _form2.ClientSideValidations.settings.html_settings, message);
          },
          removeError: function removeError(element) {
            return ClientSideValidations.formBuilders[_form2.ClientSideValidations.settings.html_settings.type].remove(element, _form2.ClientSideValidations.settings.html_settings);
          }
        };
        var eventsToBind = ClientSideValidations.eventsToBind.form(_form2, $form);

        for (var eventName in eventsToBind) {
          var eventFunction = eventsToBind[eventName];
          $form.on(eventName, eventFunction);
        }

        $form.find(ClientSideValidations.selectors.inputs).each(function () {
          ClientSideValidations.enablers.input(this);
        });
      },
      input: function input(_input) {
        var $input = $(_input);
        var form = _input.form;
        var $form = $(form);
        var eventsToBind = ClientSideValidations.eventsToBind.input(form);

        for (var eventName in eventsToBind) {
          var eventFunction = eventsToBind[eventName];
          $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
            return $(this).attr('data-validate', true);
          }).on(eventName, eventFunction);
        }

        $input.filter(':checkbox').on('change.ClientSideValidations', function () {
          $(this).isValid(form.ClientSideValidations.settings.validators);
        });
        $input.filter('[id$=_confirmation]').each(function () {
          var $element = $(this);
          var $elementToConfirm = $form.find('#' + this.id.match(/(.+)_confirmation/)[1] + ':input');

          if ($elementToConfirm.length) {
            var _eventsToBind = ClientSideValidations.eventsToBind.inputConfirmation($elementToConfirm, form);

            for (var _eventName in _eventsToBind) {
              var _eventFunction = _eventsToBind[_eventName];
              $('#' + $element.attr('id')).on(_eventName, _eventFunction);
            }
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

          form.find("label.message[for='" + element.attr('id') + "']").text(message);
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
            labelErrorField.replaceWith(label);
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
        return $.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote);
      },
      local: {},
      remote: {}
    },
    disable: function disable(target) {
      var $target = $(target);
      $target.off('.ClientSideValidations');

      if ($target.is('form')) {
        ClientSideValidations.disable($target.find(':input'));
      } else {
        $target.removeData(['changed', 'valid']);
        $target.filter(':input').each(function () {
          $(this).removeAttr('data-validate');
        });
      }
    },
    reset: function reset(form) {
      var $form = $(form);
      ClientSideValidations.disable(form);

      for (var key in form.ClientSideValidations.settings.validators) {
        form.ClientSideValidations.removeError($form.find("[name='" + key + "']"));
      }

      ClientSideValidations.enablers.form(form);
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

  var arrayHasValue = function arrayHasValue(value, otherValues) {
    for (var i = 0, l = otherValues.length; i < l; i++) {
      if (value === otherValues[i]) {
        return true;
      }
    }

    return false;
  };
  var valueIsPresent = function valueIsPresent(value) {
    return !/^\s*$/.test(value || '');
  };

  var absenceLocalValidator = function absenceLocalValidator(element, options) {
    if (valueIsPresent(element.val())) {
      return options.message;
    }
  };
  var presenceLocalValidator = function presenceLocalValidator(element, options) {
    if (!valueIsPresent(element.val())) {
      return options.message;
    }
  };

  var DEFAULT_ACCEPT_OPTION = ['1', true];
  Array.isArray || (Array.isArray = function (a) {
    var object = {};
    return '' + a !== a && object.toString.call(a) === '[object Array]';
  });

  var isTextAccepted = function isTextAccepted(value, acceptOption) {
    if (!acceptOption) {
      acceptOption = DEFAULT_ACCEPT_OPTION;
    }

    if (Array.isArray(acceptOption)) {
      return arrayHasValue(value, acceptOption);
    }

    return value === acceptOption;
  };

  var acceptanceLocalValidator = function acceptanceLocalValidator(element, options) {
    var valid = true;

    if (element.attr('type') === 'checkbox') {
      valid = element.prop('checked');
    }

    if (element.attr('type') === 'text') {
      valid = isTextAccepted(element.val(), options.accept);
    }

    if (!valid) {
      return options.message;
    }
  };

  var isMatching = function isMatching(value, regExpOptions) {
    return new RegExp(regExpOptions.source, regExpOptions.options).test(value);
  };

  var hasValidFormat = function hasValidFormat(value, withOptions, withoutOptions) {
    return withOptions && isMatching(value, withOptions) || withoutOptions && !isMatching(value, withoutOptions);
  };

  var formatLocalValidator = function formatLocalValidator(element, options) {
    var value = element.val();

    if (options.allow_blank && !valueIsPresent(value)) {
      return;
    }

    if (!hasValidFormat(value, options["with"], options.without)) {
      return options.message;
    }
  };

  var VALIDATIONS = {
    even: function even(a) {
      return parseInt(a, 10) % 2 === 0;
    },
    greater_than: function greater_than(a, b) {
      return parseFloat(a) > parseFloat(b);
    },
    greater_than_or_equal_to: function greater_than_or_equal_to(a, b) {
      return parseFloat(a) >= parseFloat(b);
    },
    equal_to: function equal_to(a, b) {
      return parseFloat(a) === parseFloat(b);
    },
    less_than: function less_than(a, b) {
      return parseFloat(a) < parseFloat(b);
    },
    less_than_or_equal_to: function less_than_or_equal_to(a, b) {
      return parseFloat(a) <= parseFloat(b);
    },
    odd: function odd(a) {
      return parseInt(a, 10) % 2 === 1;
    }
  };

  var getOtherValue = function getOtherValue(validationOption, $form) {
    if (!isNaN(parseFloat(validationOption))) {
      return validationOption;
    }

    var validationElement = $form.find('[name*=' + validationOption + ']');

    if (validationElement.length === 1) {
      var numberFormat = $form[0].ClientSideValidations.settings.number_format;
      var otherFormattedValue = $.trim(validationElement.val()).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.');

      if (!isNaN(parseFloat(otherFormattedValue))) {
        return otherFormattedValue;
      }
    }
  };

  var isValid = function isValid(validationFunction, validationOption, formattedValue, $form) {
    if (validationFunction.length === 2) {
      var otherValue = getOtherValue(validationOption, $form);
      return otherValue == null || otherValue === '' || validationFunction(formattedValue, otherValue);
    } else {
      return validationFunction(formattedValue);
    }
  };

  var runFunctionValidations = function runFunctionValidations(formattedValue, $form, options) {
    for (var validation in VALIDATIONS) {
      var validationOption = options[validation];
      var validationFunction = VALIDATIONS[validation]; // Must check for null because this could be 0

      if (validationOption == null) {
        continue;
      }

      if (!isValid(validationFunction, validationOption, formattedValue, $form)) {
        return options.messages[validation];
      }
    }
  };

  var runValidations = function runValidations(formattedValue, $form, options) {
    if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(formattedValue)) {
      return options.messages.only_integer;
    }

    if (!ClientSideValidations.patterns.numericality["default"].test(formattedValue)) {
      return options.messages.numericality;
    }

    return runFunctionValidations(formattedValue, $form, options);
  };

  var numericalityLocalValidator = function numericalityLocalValidator(element, options) {
    var value = element.val();

    if (options.allow_blank && !valueIsPresent(value)) {
      return;
    }

    var $form = $(element[0].form);
    var numberFormat = $form[0].ClientSideValidations.settings.number_format;
    var formattedValue = $.trim(value).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.');
    return runValidations(formattedValue, $form, options);
  };

  var VALIDATIONS$1 = {
    is: function is(a, b) {
      return a === parseInt(b, 10);
    },
    minimum: function minimum(a, b) {
      return a >= parseInt(b, 10);
    },
    maximum: function maximum(a, b) {
      return a <= parseInt(b, 10);
    }
  };

  var runValidations$1 = function runValidations(valueLength, options) {
    for (var validation in VALIDATIONS$1) {
      var validationOption = options[validation];
      var validationFunction = VALIDATIONS$1[validation];

      if (validationOption && !validationFunction(valueLength, validationOption)) {
        return options.messages[validation];
      }
    }
  };

  var lengthLocalValidator = function lengthLocalValidator(element, options) {
    var value = element.val();

    if (options.allow_blank && !valueIsPresent(value)) {
      return;
    }

    return runValidations$1(value.length, options);
  };

  var isInList = function isInList(value, otherValues) {
    var normalizedOtherValues = [];

    for (var otherValueIndex in otherValues) {
      normalizedOtherValues.push(otherValues[otherValueIndex].toString());
    }

    return arrayHasValue(value, normalizedOtherValues);
  };

  var isInRange = function isInRange(value, range) {
    return value >= range[0] && value <= range[1];
  };

  var isIncluded = function isIncluded(value, options, allowBlank) {
    if ((options.allow_blank && !valueIsPresent(value)) === allowBlank) {
      return true;
    }

    return options["in"] && isInList(value, options["in"]) || options.range && isInRange(value, options.range);
  };

  var exclusionLocalValidator = function exclusionLocalValidator(element, options) {
    var value = element.val();

    if (isIncluded(value, options, false) || !options.allow_blank && !valueIsPresent(value)) {
      return options.message;
    }
  };
  var inclusionLocalValidator = function inclusionLocalValidator(element, options) {
    if (!isIncluded(element.val(), options, true)) {
      return options.message;
    }
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

  var isLocallyUnique = function isLocallyUnique(currentElement, value, otherValue, caseSensitive) {
    if (!caseSensitive) {
      value = value.toLowerCase();
      otherValue = otherValue.toLowerCase();
    }

    if (otherValue === value) {
      $(currentElement).data('notLocallyUnique', true);
      return false;
    }

    if ($(currentElement).data('notLocallyUnique')) {
      $(currentElement).removeData('notLocallyUnique').data('changed', true);
    }

    return true;
  };

  var uniquenessLocalValidator = function uniquenessLocalValidator(element, options) {
    var elementName = element.attr('name');
    var matches = elementName.match(/^(.+_attributes\])\[\d+\](.+)$/);

    if (!matches) {
      return;
    }

    var form = element.closest('form');
    var value = element.val();
    var valid = true;
    form.find(':input[name^="' + matches[1] + '"][name$="' + matches[2] + '"]').not(element).each(function () {
      var otherValue = $(this).val();

      if (!isLocallyUnique(this, value, otherValue, options.case_sensitive)) {
        valid = false;
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
    var _this = this;

    var selectors = {
      forms: 'form',
      inputs: 'input'
    };

    var _loop = function _loop() {
      var enablers = selectors[selector];

      _this.filter(ClientSideValidations.selectors[selector]).each(function () {
        return ClientSideValidations.enablers[enablers](this);
      });
    };

    for (var selector in selectors) {
      _loop();
    }

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

  var cleanNestedElementName = function cleanNestedElementName(elementName, nestedMatches, validators) {
    for (var validatorName in validators) {
      if (validatorName.match('\\[' + nestedMatches[1] + '\\].*\\[\\]\\[' + nestedMatches[2] + '\\]$')) {
        elementName = elementName.replace(/\[[\da-z_]+\]\[(\w+)\]$/g, '[][$1]');
      }
    }

    return elementName;
  };

  var cleanElementName = function cleanElementName(elementName, validators) {
    elementName = elementName.replace(/\[(\w+_attributes)\]\[[\da-z_]+\](?=\[(?:\w+_attributes)\])/g, '[$1][]');
    var nestedMatches = elementName.match(/\[(\w+_attributes)\].*\[(\w+)\]$/);

    if (nestedMatches) {
      elementName = cleanNestedElementName(elementName, nestedMatches, validators);
    }

    return elementName;
  };

  var validatorsFor = function validatorsFor(elementName, validators) {
    if (Object.prototype.isPrototypeOf.call(validators, elementName)) {
      return validators[elementName];
    }

    return validators[cleanElementName(elementName, validators)] || {};
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

  var passElement = function passElement(element) {
    element.trigger('element:validate:pass.ClientSideValidations').data('valid', null);
  };

  var failElement = function failElement(element, message) {
    element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false);
  };

  var afterValidate = function afterValidate(element) {
    return element.trigger('element:validate:after.ClientSideValidations').data('valid') !== false;
  };

  var executeValidator = function executeValidator(validatorFunctions, validatorFunction, validatorOptions, element) {
    for (var validatorOption in validatorOptions) {
      if (!validatorOptions[validatorOption]) {
        continue;
      }

      var message = validatorFunction.call(validatorFunctions, element, validatorOptions[validatorOption]);

      if (message) {
        failElement(element, message);
        return false;
      }
    }

    return true;
  };

  var executeValidators = function executeValidators(validatorFunctions, element, validators) {
    for (var validator in validators) {
      var validatorFunction = validatorFunctions[validator];

      if (!validatorFunction) {
        continue;
      }

      if (!executeValidator(validatorFunctions, validatorFunction, validators[validator], element)) {
        return false;
      }
    }

    return true;
  };

  var isMarkedForDestroy = function isMarkedForDestroy(element) {
    if (element.attr('name').search(/\[([^\]]*?)\]$/) >= 0) {
      var destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]');

      if ($("input[name='" + destroyInputName + "']").val() === '1') {
        return true;
      }
    }

    return false;
  };

  var executeAllValidators = function executeAllValidators(element, validators) {
    if (element.data('changed') === false) {
      return;
    }

    element.data('changed', false);

    if (executeValidators(ClientSideValidations.validators.all(), element, validators)) {
      passElement(element);
    }
  };

  var validateElement = function validateElement(element, validators) {
    element.trigger('element:validate:before.ClientSideValidations');

    if (isMarkedForDestroy(element)) {
      passElement(element);
    } else {
      executeAllValidators(element, validators);
    }

    return afterValidate(element);
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

  return ClientSideValidations;

}));

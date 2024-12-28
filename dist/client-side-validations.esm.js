/*!
 * Client Side Validations JS - v0.5.0 (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) 2024 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

import jQuery from 'jquery';

const arrayHasValue = (value, otherValues) => {
  for (let i = 0, l = otherValues.length; i < l; i++) {
    if (value === otherValues[i]) {
      return true;
    }
  }
  return false;
};
const createElementFromHTML = html => {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.firstChild;
};
const isValuePresent = value => {
  return !/^\s*$/.test(value || '');
};

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
      'submit.ClientSideValidations': eventData => {
        if (!$form.isValid(form.ClientSideValidations.settings.validators)) {
          eventData.preventDefault();
          eventData.stopImmediatePropagation();
        }
      },
      'ajax:beforeSend.ClientSideValidations': function (eventData) {
        if (eventData.target === this) {
          $form.isValid(form.ClientSideValidations.settings.validators);
        }
      },
      'form:validate:after.ClientSideValidations': eventData => {
        ClientSideValidations.callbacks.form.after($form, eventData);
      },
      'form:validate:before.ClientSideValidations': eventData => {
        ClientSideValidations.callbacks.form.before($form, eventData);
      },
      'form:validate:fail.ClientSideValidations': eventData => {
        ClientSideValidations.callbacks.form.fail($form, eventData);
      },
      'form:validate:pass.ClientSideValidations': eventData => {
        ClientSideValidations.callbacks.form.pass($form, eventData);
      }
    }),
    input: form => ({
      'focusout.ClientSideValidations': function () {
        jQuery(this).isValid(form.ClientSideValidations.settings.validators);
      },
      'change.ClientSideValidations': function () {
        this.dataset.csvChanged = 'true';
      },
      'element:validate:after.ClientSideValidations': function (eventData) {
        ClientSideValidations.callbacks.element.after(jQuery(this), eventData);
      },
      'element:validate:before.ClientSideValidations': function (eventData) {
        ClientSideValidations.callbacks.element.before(jQuery(this), eventData);
      },
      'element:validate:fail.ClientSideValidations': function (eventData, message) {
        const $element = jQuery(this);
        ClientSideValidations.callbacks.element.fail($element, message, function () {
          form.ClientSideValidations.addError($element, message);
        }, eventData);
      },
      'element:validate:pass.ClientSideValidations': function (eventData) {
        const $element = jQuery(this);
        ClientSideValidations.callbacks.element.pass($element, function () {
          form.ClientSideValidations.removeError($element);
        }, eventData);
      }
    }),
    inputConfirmation: ($element, form) => ({
      'focusout.ClientSideValidations': () => {
        $element[0].dataset.csvChanged = 'true';
        $element.isValid(form.ClientSideValidations.settings.validators);
      },
      'keyup.ClientSideValidations': () => {
        $element[0].dataset.csvChanged = 'true';
        $element.isValid(form.ClientSideValidations.settings.validators);
      }
    })
  },
  enablers: {
    form: form => {
      const $form = jQuery(form);
      form.ClientSideValidations = {
        settings: JSON.parse(form.dataset.clientSideValidations),
        addError: ($element, message) => ClientSideValidations.formBuilders[form.ClientSideValidations.settings.html_settings.type].add($element, form.ClientSideValidations.settings.html_settings, message),
        removeError: $element => ClientSideValidations.formBuilders[form.ClientSideValidations.settings.html_settings.type].remove($element, form.ClientSideValidations.settings.html_settings)
      };
      const eventsToBind = ClientSideValidations.eventsToBind.form(form, $form);
      for (const eventName in eventsToBind) {
        const eventFunction = eventsToBind[eventName];
        $form.on(eventName, eventFunction);
      }
      $form.find(ClientSideValidations.selectors.inputs).each(function () {
        ClientSideValidations.enablers.input(this);
      });
    },
    input: function (input) {
      const $input = jQuery(input);
      const form = input.form;
      const $form = jQuery(form);
      const eventsToBind = ClientSideValidations.eventsToBind.input(form);
      for (const eventName in eventsToBind) {
        const eventFunction = eventsToBind[eventName];
        $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
          this.dataset.csvValidate = 'true';
        }).on(eventName, eventFunction);
      }
      $input.filter(':checkbox').on('change.ClientSideValidations', function () {
        jQuery(this).isValid(form.ClientSideValidations.settings.validators);
      });
      $input.filter('[id$=_confirmation]').each(function () {
        const $element = jQuery(this);
        const $elementToConfirm = $form.find("#".concat(this.id.match(/(.+)_confirmation/)[1], ":input"));
        if ($elementToConfirm.length) {
          const eventsToBind = ClientSideValidations.eventsToBind.inputConfirmation($elementToConfirm, form);
          for (const eventName in eventsToBind) {
            const eventFunction = eventsToBind[eventName];
            jQuery("#".concat($element.attr('id'))).on(eventName, eventFunction);
          }
        }
      });
    }
  },
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: ($element, settings, message) => {
        const element = $element[0];
        const form = element.form;
        const inputErrorTemplate = createElementFromHTML(settings.input_tag);
        let inputErrorElement = element.closest(".".concat(inputErrorTemplate.getAttribute('class').replace(/ /g, '.')));
        if (!inputErrorElement) {
          inputErrorElement = inputErrorTemplate;
          if (element.getAttribute('autofocus')) {
            element.setAttribute('autofocus', false);
          }
          element.before(inputErrorElement);
          inputErrorElement.querySelector('span#input_tag').replaceWith(element);
          const inputErrorLabelMessageElement = inputErrorElement.querySelector('label.message');
          if (inputErrorLabelMessageElement) {
            inputErrorLabelMessageElement.setAttribute('for', element.id);
          }
        }
        const labelElement = form.querySelector("label[for=\"".concat(element.id, "\"]:not(.message)"));
        if (labelElement) {
          const labelErrorTemplate = createElementFromHTML(settings.label_tag);
          const labelErrorContainer = labelElement.closest(".".concat(labelErrorTemplate.getAttribute('class').replace(/ /g, '.')));
          if (!labelErrorContainer) {
            labelElement.after(labelErrorTemplate);
            labelErrorTemplate.querySelector('label#label_tag').replaceWith(labelElement);
          }
        }
        const labelMessageElement = form.querySelector("label.message[for=\"".concat(element.id, "\"]"));
        if (labelMessageElement) {
          labelMessageElement.textContent = message;
        }
      },
      remove: ($element, settings) => {
        const element = $element[0];
        const form = element.form;
        const inputErrorClass = createElementFromHTML(settings.input_tag).getAttribute('class');
        const inputErrorElement = element.closest(".".concat(inputErrorClass.replace(/ /g, '.')));
        if (inputErrorElement) {
          inputErrorElement.querySelector("#".concat(element.id)).remove();
          inputErrorElement.replaceWith(element);
        }
        const labelElement = form.querySelector("label[for=\"".concat(element.id, "\"]:not(.message)"));
        if (labelElement) {
          const labelErrorClass = createElementFromHTML(settings.label_tag).getAttribute('class');
          const labelErrorElement = labelElement.closest(".".concat(labelErrorClass.replace(/ /g, '.')));
          if (labelErrorElement) {
            labelErrorElement.replaceWith(labelElement);
          }
        }
        const labelMessageElement = form.querySelector("label.message[for=\"".concat(element.id, "\"]"));
        if (labelMessageElement) {
          labelMessageElement.remove();
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
    validate_inputs: ':input:enabled:visible[data-csv-validate]',
    forms: 'form[data-client-side-validations]'
  },
  validators: {
    all: () => {
      return {
        ...ClientSideValidations.validators.local,
        ...ClientSideValidations.validators.remote
      };
    },
    local: {},
    remote: {}
  },
  disable: target => {
    const $target = jQuery(target);
    $target.off('.ClientSideValidations');
    if ($target.is('form')) {
      ClientSideValidations.disable($target.find(':input'));
    } else {
      delete $target[0].dataset.csvValid;
      delete $target[0].dataset.csvChanged;
      $target.filter(':input').each(function () {
        delete this.dataset.csvValidate;
      });
    }
  },
  reset: form => {
    const $form = jQuery(form);
    ClientSideValidations.disable(form);
    for (const key in form.ClientSideValidations.settings.validators) {
      form.ClientSideValidations.removeError($form.find("[name=\"".concat(key, "\"]")));
    }
    ClientSideValidations.enablers.form(form);
  },
  initializeOnEvent: () => {
    if (window.Turbo != null) {
      return 'turbo:load';
    } else if (window.Turbolinks != null && window.Turbolinks.supported) {
      return window.Turbolinks.EVENTS != null ? 'page:change' : 'turbolinks:load';
    }
  },
  start: () => {
    const initializeOnEvent = ClientSideValidations.initializeOnEvent();
    if (initializeOnEvent != null) {
      jQuery(document).on(initializeOnEvent, () => jQuery(ClientSideValidations.selectors.forms).validate());
    } else {
      jQuery(() => jQuery(ClientSideValidations.selectors.forms).validate());
    }
  }
};

const absenceLocalValidator = ($element, options) => {
  const element = $element[0];
  if (isValuePresent(element.value)) {
    return options.message;
  }
};
const presenceLocalValidator = ($element, options) => {
  const element = $element[0];
  if (!isValuePresent(element.value)) {
    return options.message;
  }
};

const DEFAULT_ACCEPT_OPTION = ['1', true];
const isTextAccepted = (value, acceptOption) => {
  if (!acceptOption) {
    acceptOption = DEFAULT_ACCEPT_OPTION;
  }
  if (Array.isArray(acceptOption)) {
    return arrayHasValue(value, acceptOption);
  }
  return value === acceptOption;
};
const acceptanceLocalValidator = ($element, options) => {
  const element = $element[0];
  let valid = true;
  if (element.type === 'checkbox') {
    valid = element.checked;
  }
  if (element.type === 'text') {
    valid = isTextAccepted(element.value, options.accept);
  }
  if (!valid) {
    return options.message;
  }
};

const isMatching = (value, regExpOptions) => {
  return new RegExp(regExpOptions.source, regExpOptions.options).test(value);
};
const hasValidFormat = (value, withOptions, withoutOptions) => {
  return withOptions && isMatching(value, withOptions) || withoutOptions && !isMatching(value, withoutOptions);
};
const formatLocalValidator = ($element, options) => {
  const element = $element[0];
  const value = element.value;
  if (options.allow_blank && !isValuePresent(value)) {
    return;
  }
  if (!hasValidFormat(value, options.with, options.without)) {
    return options.message;
  }
};

const VALIDATIONS$1 = {
  even: a => {
    return parseInt(a, 10) % 2 === 0;
  },
  greater_than: (a, b) => {
    return parseFloat(a) > parseFloat(b);
  },
  greater_than_or_equal_to: (a, b) => {
    return parseFloat(a) >= parseFloat(b);
  },
  equal_to: (a, b) => {
    return parseFloat(a) === parseFloat(b);
  },
  less_than: (a, b) => {
    return parseFloat(a) < parseFloat(b);
  },
  less_than_or_equal_to: (a, b) => {
    return parseFloat(a) <= parseFloat(b);
  },
  odd: a => {
    return parseInt(a, 10) % 2 === 1;
  },
  other_than: (a, b) => {
    return parseFloat(a) !== parseFloat(b);
  }
};
const formatValue = element => {
  const value = element.value || '';
  const numberFormat = element.form.ClientSideValidations.settings.number_format;
  return value.trim().replace(new RegExp("\\".concat(numberFormat.separator), 'g'), '.');
};
const getOtherValue = (validationOption, form) => {
  if (!isNaN(parseFloat(validationOption))) {
    return validationOption;
  }
  const validationElements = form.querySelectorAll("[name*=\"".concat(validationOption, "\"]"));
  if (validationElements.length === 1) {
    const validationElement = validationElements[0];
    const otherFormattedValue = formatValue(validationElement);
    if (!isNaN(parseFloat(otherFormattedValue))) {
      return otherFormattedValue;
    }
  }
};
const isValid = (validationFunction, validationOption, formattedValue, form) => {
  if (validationFunction.length === 2) {
    const otherValue = getOtherValue(validationOption, form);
    return otherValue == null || otherValue === '' || validationFunction(formattedValue, otherValue);
  } else {
    return validationFunction(formattedValue);
  }
};
const runFunctionValidations = (formattedValue, form, options) => {
  for (const validation in VALIDATIONS$1) {
    const validationOption = options[validation];
    const validationFunction = VALIDATIONS$1[validation];

    // Must check for null because this could be 0
    if (validationOption == null) {
      continue;
    }
    if (!isValid(validationFunction, validationOption, formattedValue, form)) {
      return options.messages[validation];
    }
  }
};
const runValidations$1 = (formattedValue, form, options) => {
  if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(formattedValue)) {
    return options.messages.only_integer;
  }
  if (!ClientSideValidations.patterns.numericality.default.test(formattedValue)) {
    return options.messages.numericality;
  }
  return runFunctionValidations(formattedValue, form, options);
};
const numericalityLocalValidator = ($element, options) => {
  const element = $element[0];
  const value = element.value;
  if (options.allow_blank && !isValuePresent(value)) {
    return;
  }
  const form = element.form;
  const formattedValue = formatValue(element);
  return runValidations$1(formattedValue, form, options);
};

const VALIDATIONS = {
  is: (a, b) => {
    return a === parseInt(b, 10);
  },
  minimum: (a, b) => {
    return a >= parseInt(b, 10);
  },
  maximum: (a, b) => {
    return a <= parseInt(b, 10);
  }
};
const runValidations = (valueLength, options) => {
  for (const validation in VALIDATIONS) {
    const validationOption = options[validation];
    const validationFunction = VALIDATIONS[validation];
    if (validationOption && !validationFunction(valueLength, validationOption)) {
      return options.messages[validation];
    }
  }
};
const lengthLocalValidator = ($element, options) => {
  const element = $element[0];
  const value = element.value;
  if (options.allow_blank && !isValuePresent(value)) {
    return;
  }
  return runValidations(value.length, options);
};

const isInList = (value, otherValues) => {
  const normalizedOtherValues = [];
  for (const otherValueIndex in otherValues) {
    normalizedOtherValues.push(otherValues[otherValueIndex].toString());
  }
  return arrayHasValue(value, normalizedOtherValues);
};
const isInRange = (value, range) => {
  return value >= range[0] && value <= range[1];
};
const isIncluded = (value, options, allowBlank) => {
  if ((options.allow_blank && !isValuePresent(value)) === allowBlank) {
    return true;
  }
  return options.in && isInList(value, options.in) || options.range && isInRange(value, options.range);
};
const exclusionLocalValidator = ($element, options) => {
  const element = $element[0];
  const value = element.value;
  if (isIncluded(value, options, false) || !options.allow_blank && !isValuePresent(value)) {
    return options.message;
  }
};
const inclusionLocalValidator = ($element, options) => {
  const element = $element[0];
  const value = element.value;
  if (!isIncluded(value, options, true)) {
    return options.message;
  }
};

const confirmationLocalValidator = ($element, options) => {
  const element = $element[0];
  let value = element.value;
  let confirmationValue = document.getElementById("".concat(element.id, "_confirmation")).value;
  if (!options.case_sensitive) {
    value = value.toLowerCase();
    confirmationValue = confirmationValue.toLowerCase();
  }
  if (value !== confirmationValue) {
    return options.message;
  }
};

const isLocallyUnique = (element, value, otherValue, caseSensitive) => {
  if (!caseSensitive) {
    value = value.toLowerCase();
    otherValue = otherValue.toLowerCase();
  }
  if (otherValue === value) {
    element.dataset.notLocallyUnique = true;
    return false;
  }
  if (element.dataset.notLocallyUnique) {
    delete element.dataset.notLocallyUnique;
    element.dataset.changed = true;
  }
  return true;
};
const uniquenessLocalValidator = ($element, options) => {
  const element = $element[0];
  const elementName = element.name;
  const matches = elementName.match(/^(.+_attributes\])\[\d+\](.+)$/);
  if (!matches) {
    return;
  }
  const form = element.form;
  const value = element.value;
  let valid = true;
  const query = "[name^=\"".concat(matches[1], "\"][name$=\"").concat(matches[2], "\"]:not([name=\"").concat(elementName, "\"])");
  const otherElements = form.querySelectorAll(query);
  Array.prototype.slice.call(otherElements).forEach(function (otherElement) {
    const otherValue = otherElement.value;
    if (!isLocallyUnique(otherElement, value, otherValue, options.case_sensitive)) {
      valid = false;
    }
  });
  if (!valid) {
    return options.message;
  }
};

// Validators will run in the following order
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
jQuery.fn.disableClientSideValidations = function () {
  ClientSideValidations.disable(this);
  return this;
};
jQuery.fn.enableClientSideValidations = function () {
  const selectors = {
    forms: 'form',
    inputs: 'input'
  };
  for (const selector in selectors) {
    const enablers = selectors[selector];
    this.filter(ClientSideValidations.selectors[selector]).each(function () {
      ClientSideValidations.enablers[enablers](this);
    });
  }
  return this;
};
jQuery.fn.resetClientSideValidations = function () {
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    ClientSideValidations.reset(this);
  });
  return this;
};
jQuery.fn.validate = function () {
  this.filter(ClientSideValidations.selectors.forms).each(function () {
    jQuery(this).enableClientSideValidations();
  });
  return this;
};
jQuery.fn.isValid = function (validators) {
  const obj = jQuery(this[0]);
  if (obj.is('form')) {
    return validateForm(obj, validators);
  } else {
    return validateElement(obj, validatorsFor(this[0].name, validators));
  }
};
const cleanNestedElementName = (elementName, nestedMatches, validators) => {
  for (const validatorName in validators) {
    if (validatorName.match("\\[".concat(nestedMatches[1], "\\].*\\[\\]\\[").concat(nestedMatches[2], "\\]$"))) {
      elementName = elementName.replace(/\[[\da-z_]+\]\[(\w+)\]$/g, '[][$1]');
    }
  }
  return elementName;
};
const cleanElementName = (elementName, validators) => {
  elementName = elementName.replace(/\[(\w+_attributes)\]\[[\da-z_]+\](?=\[(?:\w+_attributes)\])/g, '[$1][]');
  const nestedMatches = elementName.match(/\[(\w+_attributes)\].*\[(\w+)\]$/);
  if (nestedMatches) {
    elementName = cleanNestedElementName(elementName, nestedMatches, validators);
  }
  return elementName;
};
const validatorsFor = (elementName, validators) => {
  if (Object.prototype.hasOwnProperty.call(validators, elementName)) {
    return validators[elementName];
  }
  return validators[cleanElementName(elementName, validators)] || {};
};
const validateForm = ($form, validators) => {
  let valid = true;
  $form.trigger('form:validate:before.ClientSideValidations');
  $form.find(ClientSideValidations.selectors.validate_inputs).each(function () {
    if (!jQuery(this).isValid(validators)) {
      valid = false;
    }
    return true;
  });
  if (valid) {
    $form.trigger('form:validate:pass.ClientSideValidations');
  } else {
    $form.trigger('form:validate:fail.ClientSideValidations');
  }
  $form.trigger('form:validate:after.ClientSideValidations');
  return valid;
};
const passElement = $element => {
  const element = $element[0];
  $element.trigger('element:validate:pass.ClientSideValidations');
  delete element.dataset.csvValid;
};
const failElement = ($element, message) => {
  const element = $element[0];
  $element.trigger('element:validate:fail.ClientSideValidations', message);
  element.dataset.csvValid = 'false';
};
const afterValidate = $element => {
  const element = $element[0];
  $element.trigger('element:validate:after.ClientSideValidations');
  return element.dataset.csvValid !== 'false';
};
const executeValidator = (validatorFunctions, validatorFunction, validatorOptions, $element) => {
  for (const validatorOption in validatorOptions) {
    if (!validatorOptions[validatorOption]) {
      continue;
    }
    const message = validatorFunction.call(validatorFunctions, $element, validatorOptions[validatorOption]);
    if (message) {
      failElement($element, message);
      return false;
    }
  }
  return true;
};
const executeValidators = (validatorFunctions, $element, validators) => {
  for (const validator in validators) {
    if (!validatorFunctions[validator]) {
      continue;
    }
    if (!executeValidator(validatorFunctions, validatorFunctions[validator], validators[validator], $element)) {
      return false;
    }
  }
  return true;
};
const isMarkedForDestroy = $element => {
  const element = $element[0];
  const elementName = element.name;
  if (/\[([^\]]*?)\]$/.test(elementName)) {
    const destroyInputName = elementName.replace(/\[([^\]]*?)\]$/, '[_destroy]');
    const destroyInputElement = document.querySelector("input[name=\"".concat(destroyInputName, "\"]"));
    if (destroyInputElement && destroyInputElement.value === '1') {
      return true;
    }
  }
  return false;
};
const executeAllValidators = ($element, validators) => {
  const element = $element[0];
  if (element.dataset.csvChanged === 'false' || element.disabled) {
    return;
  }
  element.dataset.csvChanged = 'false';
  if (executeValidators(ClientSideValidations.validators.all(), $element, validators)) {
    passElement($element);
  }
};
const validateElement = ($element, validators) => {
  $element.trigger('element:validate:before.ClientSideValidations');
  if (isMarkedForDestroy($element)) {
    passElement($element);
  } else {
    executeAllValidators($element, validators);
  }
  return afterValidate($element);
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
  return typeof exports === 'object' && typeof module !== 'undefined';
}

export { ClientSideValidations as default };

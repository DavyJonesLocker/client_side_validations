/*!
 * Client Side Validations JS - v25.0.0 (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) 2026 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

import { Controller } from '@hotwired/stimulus';

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
const isDOMCollection = target => {
  return Array.isArray(target) || typeof NodeList !== 'undefined' && target instanceof NodeList || typeof HTMLCollection !== 'undefined' && target instanceof HTMLCollection || typeof RadioNodeList !== 'undefined' && target instanceof RadioNodeList;
};
const isDOMElement = target => {
  return target != null && target.nodeType === 1;
};
const getDOMElements = target => {
  if (target == null) {
    return [];
  }
  if (isDOMElement(target)) {
    return [target];
  }
  if (isDOMCollection(target)) {
    return Array.from(target).filter(isDOMElement);
  }
  return [];
};
const isFormElement = element => {
  return element.tagName === 'FORM';
};
const isVisible = element => {
  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};
const isValuePresent = value => {
  return !/^\s*$/.test(value || '');
};

const ClientSideValidations = {
  callbacks: {
    element: {
      after: (element, eventData) => {},
      before: (element, eventData) => {},
      fail: (element, message, addError, eventData) => addError(),
      pass: (element, removeError, eventData) => removeError()
    },
    form: {
      after: (form, eventData) => {},
      before: (form, eventData) => {},
      fail: (form, eventData) => {},
      pass: (form, eventData) => {}
    }
  },
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: (element, settings, message) => {
        if (!element) {
          return;
        }
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
      remove: (element, settings) => {
        if (!element) {
          return;
        }
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
  validators: {
    all: () => {
      return {
        ...ClientSideValidations.validators.local,
        ...ClientSideValidations.validators.remote
      };
    },
    local: {},
    remote: {}
  }
};

function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateMethodInitSpec(e, a) {
  _checkPrivateRedeclaration(e, a), a.add(e);
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

const boundEventListeners = new WeakMap();
const addBoundEventListener = (element, eventName, listener) => {
  element.addEventListener(eventName, listener);
  const listeners = boundEventListeners.get(element) || [];
  listeners.push({
    eventName,
    listener
  });
  boundEventListeners.set(element, listeners);
};
const bindElementEvents = (element, eventsToBind) => {
  for (const eventName in eventsToBind) {
    addBoundEventListener(element, eventName, eventsToBind[eventName]);
  }
};
const clearBoundEventListeners = element => {
  const listeners = boundEventListeners.get(element);
  if (!listeners) {
    return;
  }
  listeners.forEach(_ref => {
    let {
      eventName,
      listener
    } = _ref;
    element.removeEventListener(eventName, listener);
  });
  boundEventListeners.delete(element);
};
const dispatchCustomEvent = (element, eventName, detail) => {
  element.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    detail
  }));
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
  if (!elementName || !validators) {
    return {};
  }
  if (Object.prototype.hasOwnProperty.call(validators, elementName)) {
    return validators[elementName];
  }
  return validators[cleanElementName(elementName, validators)] || {};
};
const getValidationInputs = form => {
  return Array.from(form.elements).filter(element => {
    if (element.dataset.csvValidate == null || element.disabled) {
      return false;
    }
    return isVisible(element);
  });
};
const passElement = element => {
  dispatchCustomEvent(element, 'element:validate:pass');
  delete element.dataset.csvValid;
};
const failElement = (element, message) => {
  dispatchCustomEvent(element, 'element:validate:fail', message);
  element.dataset.csvValid = 'false';
};
const afterValidate = element => {
  dispatchCustomEvent(element, 'element:validate:after');
  return element.dataset.csvValid !== 'false';
};
const executeValidator = (validatorFunctions, validatorFunction, validatorOptions, element) => {
  for (const validatorOption in validatorOptions) {
    if (!validatorOptions[validatorOption]) {
      continue;
    }
    const message = validatorFunction.call(validatorFunctions, element, validatorOptions[validatorOption]);
    if (message) {
      failElement(element, message);
      return false;
    }
  }
  return true;
};
const executeValidators = (validatorFunctions, element, validators) => {
  for (const validator in validators) {
    if (!validatorFunctions[validator]) {
      continue;
    }
    if (!executeValidator(validatorFunctions, validatorFunctions[validator], validators[validator], element)) {
      return false;
    }
  }
  return true;
};
const isMarkedForDestroy = element => {
  const elementName = element.name;
  const form = element.form;
  if (form && /\[([^\]]*?)\]$/.test(elementName)) {
    const destroyInputName = elementName.replace(/\[([^\]]*?)\]$/, '[_destroy]');
    const destroyInputElement = form.querySelector("input[name=\"".concat(destroyInputName, "\"]"));
    if (destroyInputElement && destroyInputElement.value === '1') {
      return true;
    }
  }
  return false;
};
const executeAllValidators = (element, validators) => {
  if (element.dataset.csvChanged === 'false' || element.disabled) {
    return;
  }
  element.dataset.csvChanged = 'false';
  if (executeValidators(ClientSideValidations.validators.all(), element, validators)) {
    passElement(element);
  }
};
const validateElement = (element, validators) => {
  dispatchCustomEvent(element, 'element:validate:before');
  if (isMarkedForDestroy(element)) {
    passElement(element);
  } else {
    executeAllValidators(element, validators);
  }
  return afterValidate(element);
};
const validateForm = (form, validators) => {
  let valid = true;
  dispatchCustomEvent(form, 'form:validate:before');
  getValidationInputs(form).forEach(element => {
    if (!validateElement(element, validatorsFor(element.name, validators))) {
      valid = false;
    }
  });
  if (valid) {
    dispatchCustomEvent(form, 'form:validate:pass');
  } else {
    dispatchCustomEvent(form, 'form:validate:fail');
  }
  dispatchCustomEvent(form, 'form:validate:after');
  return valid;
};
const isValid$1 = (target, validators) => {
  const element = getDOMElements(target)[0];
  if (!element) {
    return true;
  }
  if (!validators) {
    var _form$ClientSideValid;
    const form = isFormElement(element) ? element : element.form;
    validators = form === null || form === void 0 || (_form$ClientSideValid = form.ClientSideValidations) === null || _form$ClientSideValid === void 0 || (_form$ClientSideValid = _form$ClientSideValid.settings) === null || _form$ClientSideValid === void 0 ? void 0 : _form$ClientSideValid.validators;
  }
  if (isFormElement(element)) {
    return validateForm(element, validators || {});
  }
  return validateElement(element, validatorsFor(element.name, validators || {}));
};

const buildErrorHelpers = settings => ({
  addError: (element, message) => ClientSideValidations.formBuilders[settings.html_settings.type].add(element, settings.html_settings, message),
  removeError: element => ClientSideValidations.formBuilders[settings.html_settings.type].remove(element, settings.html_settings)
});
const installFormContext = (form, settings) => {
  const {
    addError,
    removeError
  } = buildErrorHelpers(settings);
  form.ClientSideValidations = {
    settings,
    addError,
    removeError
  };
};
const removeFormContext = form => {
  delete form.ClientSideValidations;
};
const bindFormEvents = form => {
  bindElementEvents(form, {
    submit: event => {
      if (!isValid$1(form, form.ClientSideValidations.settings.validators)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    'form:validate:after': event => ClientSideValidations.callbacks.form.after(form, event),
    'form:validate:before': event => ClientSideValidations.callbacks.form.before(form, event),
    'form:validate:fail': event => ClientSideValidations.callbacks.form.fail(form, event),
    'form:validate:pass': event => ClientSideValidations.callbacks.form.pass(form, event)
  });
};
const bindInputEvents = (form, input) => {
  input.dataset.csvValidate = 'true';
  bindElementEvents(input, {
    focusout: function () {
      isValid$1(this, form.ClientSideValidations.settings.validators);
    },
    change: function () {
      this.dataset.csvChanged = 'true';
    },
    'element:validate:after': function (event) {
      ClientSideValidations.callbacks.element.after(this, event);
    },
    'element:validate:before': function (event) {
      ClientSideValidations.callbacks.element.before(this, event);
    },
    'element:validate:fail': function (event) {
      const element = this;
      const message = event.detail;
      ClientSideValidations.callbacks.element.fail(element, message, () => {
        form.ClientSideValidations.addError(element, message);
      }, event);
    },
    'element:validate:pass': function (event) {
      const element = this;
      ClientSideValidations.callbacks.element.pass(element, () => {
        form.ClientSideValidations.removeError(element);
      }, event);
    }
  });
  if (input.type === 'checkbox') {
    bindElementEvents(input, {
      change: function () {
        isValid$1(this, form.ClientSideValidations.settings.validators);
      }
    });
  }
};
const bindConfirmationEvents = (target, confirmation, form) => {
  bindElementEvents(confirmation, {
    focusout: () => {
      target.dataset.csvChanged = 'true';
      isValid$1(target, form.ClientSideValidations.settings.validators);
    },
    keyup: () => {
      target.dataset.csvChanged = 'true';
      isValid$1(target, form.ClientSideValidations.settings.validators);
    }
  });
};
const unbindElement = element => {
  clearBoundEventListeners(element);
  delete element.dataset.csvValid;
  delete element.dataset.csvChanged;
  delete element.dataset.csvValidate;
};

var _Class_brand = /*#__PURE__*/new WeakSet();
class _Class extends Controller {
  constructor() {
    super(...arguments);
    _classPrivateMethodInitSpec(this, _Class_brand);
  }
  connect() {
    this.element.noValidate = true;
    installFormContext(this.element, this.settingsValue);
    bindFormEvents(this.element);
  }
  disconnect() {
    unbindElement(this.element);
    this.inputTargets.forEach(input => {
      unbindElement(input);
    });
    this.confirmationTargets.forEach(confirmation => {
      unbindElement(confirmation);
    });
    removeFormContext(this.element);
  }
  inputTargetConnected(input) {
    if (input.type === 'radio' || !input.form || input.form !== this.element) {
      return;
    }
    bindInputEvents(this.element, input);
  }
  inputTargetDisconnected(input) {
    unbindElement(input);
  }
  confirmationTargetConnected(confirmation) {
    if (!confirmation.form || confirmation.form !== this.element) {
      return;
    }
    const partner = _assertClassBrand(_Class_brand, this, _findConfirmationPartner).call(this, confirmation);
    if (partner) {
      bindConfirmationEvents(partner, confirmation, this.element);
    }
  }
  confirmationTargetDisconnected(confirmation) {
    unbindElement(confirmation);
  }
  validate() {
    return isValid$1(this.element, this.settingsValue.validators);
  }
  validateElement(element) {
    return isValid$1(element, this.settingsValue.validators);
  }
}
function _findConfirmationPartner(confirmation) {
  const partnerId = confirmation.dataset.clientSideValidationsConfirms;
  if (partnerId) {
    const partner = document.getElementById(partnerId);
    if (partner && partner.form === this.element) return partner;
  }
  if (confirmation.id && confirmation.id.endsWith('_confirmation')) {
    const fallback = document.getElementById(confirmation.id.replace(/_confirmation$/, ''));
    if (fallback && fallback.form === this.element) return fallback;
  }
  return null;
}
_defineProperty(_Class, "targets", ['input', 'confirmation']);
_defineProperty(_Class, "values", {
  settings: Object
});

const absenceLocalValidator = (element, options) => {
  if (isValuePresent(element.value)) {
    return options.message;
  }
};
const presenceLocalValidator = (element, options) => {
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
const acceptanceLocalValidator = (element, options) => {
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

const confirmationLocalValidator = (element, options) => {
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
const exclusionLocalValidator = (element, options) => {
  const value = element.value;
  if (isIncluded(value, options, false) || !options.allow_blank && !isValuePresent(value)) {
    return options.message;
  }
};
const inclusionLocalValidator = (element, options) => {
  const value = element.value;
  if (!isIncluded(value, options, true)) {
    return options.message;
  }
};

const isMatching = (value, regExpOptions) => {
  return new RegExp(regExpOptions.source, regExpOptions.options).test(value);
};
const hasValidFormat = (value, withOptions, withoutOptions) => {
  return withOptions && isMatching(value, withOptions) || withoutOptions && !isMatching(value, withoutOptions);
};
const formatLocalValidator = (element, options) => {
  const value = element.value;
  if (options.allow_blank && !isValuePresent(value)) {
    return;
  }
  if (!hasValidFormat(value, options.with, options.without)) {
    return options.message;
  }
};

const VALIDATIONS$1 = {
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
const runValidations$1 = (valueLength, options) => {
  for (const validation in VALIDATIONS$1) {
    const validationOption = options[validation];
    const validationFunction = VALIDATIONS$1[validation];
    if (validationOption && !validationFunction(valueLength, validationOption)) {
      return options.messages[validation];
    }
  }
};
const lengthLocalValidator = (element, options) => {
  const value = element.value;
  if (options.allow_blank && !isValuePresent(value)) {
    return;
  }
  return runValidations$1(value.length, options);
};

const VALIDATIONS = {
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
  for (const validation in VALIDATIONS) {
    const validationOption = options[validation];
    const validationFunction = VALIDATIONS[validation];

    // Must check for null because this could be 0
    if (validationOption == null) {
      continue;
    }
    if (!isValid(validationFunction, validationOption, formattedValue, form)) {
      return options.messages[validation];
    }
  }
};
const runValidations = (formattedValue, form, options) => {
  if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(formattedValue)) {
    return options.messages.only_integer;
  }
  if (!ClientSideValidations.patterns.numericality.default.test(formattedValue)) {
    return options.messages.numericality;
  }
  return runFunctionValidations(formattedValue, form, options);
};
const numericalityLocalValidator = (element, options) => {
  const value = element.value;
  if (options.allow_blank && !isValuePresent(value)) {
    return;
  }
  const form = element.form;
  const formattedValue = formatValue(element);
  return runValidations(formattedValue, form, options);
};

const isLocallyUnique = (element, value, otherValue, caseSensitive) => {
  if (!caseSensitive) {
    value = value.toLowerCase();
    otherValue = otherValue.toLowerCase();
  }
  if (otherValue === value) {
    element.dataset.csvNotLocallyUnique = 'true';
    return false;
  }
  if (element.dataset.csvNotLocallyUnique) {
    delete element.dataset.csvNotLocallyUnique;
    element.dataset.csvChanged = 'true';
  }
  return true;
};
const uniquenessLocalValidator = (element, options) => {
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

// Validators run in this order
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
ClientSideValidations.isValid = isValid$1;
const register = function (application) {
  let identifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'client-side-validations';
  application.register(identifier, _Class);
};

export { ClientSideValidations, _Class as ClientSideValidationsController, ClientSideValidations as default, isValid$1 as isValid, register, validateElement, validateForm, validatorsFor };

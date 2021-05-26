/*!
 * Client Side Validations JS - v0.1.5 (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) 2021 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ClientSideValidations = factory(global.$));
}(this, (function ($$6) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($$6);

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  var $$5 = require('../internals/export');
  var $filter = require('../internals/array-iteration').filter;
  var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  $$5({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var DESCRIPTORS$1 = require('../internals/descriptors');
  var defineProperty$1 = require('../internals/object-define-property').f;

  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (DESCRIPTORS$1 && !(NAME in FunctionPrototype)) {
    defineProperty$1(FunctionPrototype, NAME, {
      configurable: true,
      get: function () {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var $$4 = require('../internals/export');
  var exec = require('../internals/regexp-exec');

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  $$4({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
    exec: exec
  });

  var fixRegExpWellKnownSymbolLogic$2 = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject$3 = require('../internals/an-object');
  var toLength$1 = require('../internals/to-length');
  var requireObjectCoercible$2 = require('../internals/require-object-coercible');
  var advanceStringIndex$1 = require('../internals/advance-string-index');
  var regExpExec$2 = require('../internals/regexp-exec-abstract');

  // @@match logic
  fixRegExpWellKnownSymbolLogic$2('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.es/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible$2(this);
        var matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject$3(regexp);
        var S = String(this);

        if (!rx.global) return regExpExec$2(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regExpExec$2(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var fixRegExpWellKnownSymbolLogic$1 = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject$2 = require('../internals/an-object');
  var toLength = require('../internals/to-length');
  var toInteger = require('../internals/to-integer');
  var requireObjectCoercible$1 = require('../internals/require-object-coercible');
  var advanceStringIndex = require('../internals/advance-string-index');
  var getSubstitution = require('../internals/get-substitution');
  var regExpExec$1 = require('../internals/regexp-exec-abstract');

  var max = Math.max;
  var min = Math.min;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  fixRegExpWellKnownSymbolLogic$1('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

    return [
      // `String.prototype.replace` method
      // https://tc39.es/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible$1(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        if (
          (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
          (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
        ) {
          var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
          if (res.done) return res.value;
        }

        var rx = anObject$2(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regExpExec$1(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max(min(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];
  });

  var $$3 = require('../internals/export');
  var $find = require('../internals/array-iteration').find;
  var addToUnscopables = require('../internals/add-to-unscopables');

  var FIND = 'find';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  $$3({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject$1 = require('../internals/an-object');
  var requireObjectCoercible = require('../internals/require-object-coercible');
  var sameValue = require('../internals/same-value');
  var regExpExec = require('../internals/regexp-exec-abstract');

  // @@search logic
  fixRegExpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
    return [
      // `String.prototype.search` method
      // https://tc39.es/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible(this);
        var searcher = regexp == undefined ? undefined : regexp[SEARCH];
        return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
      function (regexp) {
        var res = maybeCallNative(nativeSearch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject$1(regexp);
        var S = String(this);

        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regExpExec(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }
    ];
  });

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
            $__default['default'](this).isValid(form.ClientSideValidations.settings.validators);
          },
          'change.ClientSideValidations': function changeClientSideValidations() {
            $__default['default'](this).data('changed', true);
          },
          'element:validate:after.ClientSideValidations': function elementValidateAfterClientSideValidations(eventData) {
            ClientSideValidations.callbacks.element.after($__default['default'](this), eventData);
          },
          'element:validate:before.ClientSideValidations': function elementValidateBeforeClientSideValidations(eventData) {
            ClientSideValidations.callbacks.element.before($__default['default'](this), eventData);
          },
          'element:validate:fail.ClientSideValidations': function elementValidateFailClientSideValidations(eventData, message) {
            var $element = $__default['default'](this);
            ClientSideValidations.callbacks.element.fail($element, message, function () {
              return form.ClientSideValidations.addError($element, message);
            }, eventData);
          },
          'element:validate:pass.ClientSideValidations': function elementValidatePassClientSideValidations(eventData) {
            var $element = $__default['default'](this);
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
        var $form = $__default['default'](_form2);
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
        var $input = $__default['default'](_input);
        var form = _input.form;
        var $form = $__default['default'](form);
        var eventsToBind = ClientSideValidations.eventsToBind.input(form);

        for (var eventName in eventsToBind) {
          var eventFunction = eventsToBind[eventName];
          $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
            return $__default['default'](this).attr('data-validate', true);
          }).on(eventName, eventFunction);
        }

        $input.filter(':checkbox').on('change.ClientSideValidations', function () {
          $__default['default'](this).isValid(form.ClientSideValidations.settings.validators);
        });
        $input.filter('[id$=_confirmation]').each(function () {
          var $element = $__default['default'](this);
          var $elementToConfirm = $form.find('#' + this.id.match(/(.+)_confirmation/)[1] + ':input');

          if ($elementToConfirm.length) {
            var _eventsToBind = ClientSideValidations.eventsToBind.inputConfirmation($elementToConfirm, form);

            for (var _eventName in _eventsToBind) {
              var _eventFunction = _eventsToBind[_eventName];
              $__default['default']('#' + $element.attr('id')).on(_eventName, _eventFunction);
            }
          }
        });
      }
    },
    formBuilders: {
      'ActionView::Helpers::FormBuilder': {
        add: function add(element, settings, message) {
          var form = $__default['default'](element[0].form);

          if (element.data('valid') !== false && form.find("label.message[for='" + element.attr('id') + "']")[0] == null) {
            var inputErrorField = $__default['default'](settings.input_tag);
            var labelErrorField = $__default['default'](settings.label_tag);
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
          var form = $__default['default'](element[0].form);
          var inputErrorFieldClass = $__default['default'](settings.input_tag).attr('class');
          var inputErrorField = element.closest('.' + inputErrorFieldClass.replace(/ /g, '.'));
          var label = form.find("label[for='" + element.attr('id') + "']:not(.message)");
          var labelErrorFieldClass = $__default['default'](settings.label_tag).attr('class');
          var labelErrorField = label.closest('.' + labelErrorFieldClass.replace(/ /g, '.'));

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
        "default": /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
        only_integer: /^[+-]?\d+$/
      }
    },
    selectors: {
      inputs: ':input:not(button):not([type="submit"])[name]:visible:enabled',
      validate_inputs: ':input:enabled:visible[data-validate]',
      forms: 'form[data-client-side-validations]'
    },
    validators: {
      all: function all() {
        return $__default['default'].extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote);
      },
      local: {},
      remote: {}
    },
    disable: function disable(target) {
      var $target = $__default['default'](target);
      $target.off('.ClientSideValidations');

      if ($target.is('form')) {
        ClientSideValidations.disable($target.find(':input'));
      } else {
        $target.removeData(['changed', 'valid']);
        $target.filter(':input').each(function () {
          $__default['default'](this).removeAttr('data-validate');
        });
      }
    },
    reset: function reset(form) {
      var $form = $__default['default'](form);
      ClientSideValidations.disable(form);

      for (var key in form.ClientSideValidations.settings.validators) {
        form.ClientSideValidations.removeError($form.find("[name='" + key + "']"));
      }

      ClientSideValidations.enablers.form(form);
    },
    start: function start() {
      if (window.Turbolinks != null && window.Turbolinks.supported) {
        var initializeOnEvent = window.Turbolinks.EVENTS != null ? 'page:change' : 'turbolinks:load';
        $__default['default'](document).on(initializeOnEvent, function () {
          return $__default['default'](ClientSideValidations.selectors.forms).validate();
        });
      } else {
        $__default['default'](function () {
          return $__default['default'](ClientSideValidations.selectors.forms).validate();
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

  var $$2 = require('../internals/export');
  var isArray = require('../internals/is-array');

  // `Array.isArray` method
  // https://tc39.es/ecma262/#sec-array.isarray
  $$2({ target: 'Array', stat: true }, {
    isArray: isArray
  });

  var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
  var redefine$3 = require('../internals/redefine');
  var toString = require('../internals/object-to-string');

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!TO_STRING_TAG_SUPPORT) {
    redefine$3(Object.prototype, 'toString', toString, { unsafe: true });
  }

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

  var DESCRIPTORS = require('../internals/descriptors');
  var global = require('../internals/global');
  var isForced = require('../internals/is-forced');
  var inheritIfRequired = require('../internals/inherit-if-required');
  var defineProperty = require('../internals/object-define-property').f;
  var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
  var isRegExp = require('../internals/is-regexp');
  var getFlags = require('../internals/regexp-flags');
  var stickyHelpers = require('../internals/regexp-sticky-helpers');
  var redefine$2 = require('../internals/redefine');
  var fails$1 = require('../internals/fails');
  var enforceInternalState = require('../internals/internal-state').enforce;
  var setSpecies = require('../internals/set-species');
  var wellKnownSymbol = require('../internals/well-known-symbol');

  var MATCH = wellKnownSymbol('match');
  var NativeRegExp = global.RegExp;
  var RegExpPrototype$1 = NativeRegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;

  var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

  var FORCED = DESCRIPTORS && isForced('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y || fails$1(function () {
    re2[MATCH] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  })));

  // `RegExp` constructor
  // https://tc39.es/ecma262/#sec-regexp-constructor
  if (FORCED) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegExp(pattern);
      var flagsAreUndefined = flags === undefined;
      var sticky;

      if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
        return pattern;
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = getFlags.call(pattern);
        pattern = pattern.source;
      }

      if (UNSUPPORTED_Y) {
        sticky = !!flags && flags.indexOf('y') > -1;
        if (sticky) flags = flags.replace(/y/g, '');
      }

      var result = inheritIfRequired(
        CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
        thisIsRegExp ? this : RegExpPrototype$1,
        RegExpWrapper
      );

      if (UNSUPPORTED_Y && sticky) {
        var state = enforceInternalState(result);
        state.sticky = true;
      }

      return result;
    };
    var proxy = function (key) {
      key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
        configurable: true,
        get: function () { return NativeRegExp[key]; },
        set: function (it) { NativeRegExp[key] = it; }
      });
    };
    var keys = getOwnPropertyNames(NativeRegExp);
    var index = 0;
    while (keys.length > index) proxy(keys[index++]);
    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    redefine$2(global, 'RegExp', RegExpWrapper);
  }

  // https://tc39.es/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  var redefine$1 = require('../internals/redefine');
  var anObject = require('../internals/an-object');
  var fails = require('../internals/fails');
  var flags = require('../internals/regexp-flags');

  var TO_STRING$1 = 'toString';
  var RegExpPrototype = RegExp.prototype;
  var nativeToString = RegExpPrototype[TO_STRING$1];

  var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

  // `RegExp.prototype.toString` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine$1(RegExp.prototype, TO_STRING$1, function toString() {
      var R = anObject(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
      return '/' + p + '/' + f;
    }, { unsafe: true });
  }

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

  var $$1 = require('../internals/export');
  var parseIntImplementation = require('../internals/number-parse-int');

  // `parseInt` method
  // https://tc39.es/ecma262/#sec-parseint-string-radix
  $$1({ global: true, forced: parseInt != parseIntImplementation }, {
    parseInt: parseIntImplementation
  });

  var $ = require('../internals/export');
  var $trim = require('../internals/string-trim').trim;
  var forcedStringTrimMethod = require('../internals/string-trim-forced');

  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  $({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var VALIDATIONS$1 = {
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
      var otherFormattedValue = $__default['default'].trim(validationElement.val()).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.');

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
    for (var validation in VALIDATIONS$1) {
      var validationOption = options[validation];
      var validationFunction = VALIDATIONS$1[validation]; // Must check for null because this could be 0

      if (validationOption == null) {
        continue;
      }

      if (!isValid(validationFunction, validationOption, formattedValue, $form)) {
        return options.messages[validation];
      }
    }
  };

  var runValidations$1 = function runValidations(formattedValue, $form, options) {
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

    var $form = $__default['default'](element[0].form);
    var numberFormat = $form[0].ClientSideValidations.settings.number_format;
    var formattedValue = $__default['default'].trim(value).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.');
    return runValidations$1(formattedValue, $form, options);
  };

  var VALIDATIONS = {
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

  var runValidations = function runValidations(valueLength, options) {
    for (var validation in VALIDATIONS) {
      var validationOption = options[validation];
      var validationFunction = VALIDATIONS[validation];

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

    return runValidations(value.length, options);
  };

  var redefine = require('../internals/redefine');

  var DatePrototype = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING = 'toString';
  var nativeDateToString = DatePrototype[TO_STRING];
  var getTime = DatePrototype.getTime;

  // `Date.prototype.toString` method
  // https://tc39.es/ecma262/#sec-date.prototype.tostring
  if (new Date(NaN) + '' != INVALID_DATE) {
    redefine(DatePrototype, TO_STRING, function toString() {
      var value = getTime.call(this);
      // eslint-disable-next-line no-self-compare -- NaN check
      return value === value ? nativeDateToString.call(this) : INVALID_DATE;
    });
  }

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
    var confirmationValue = $__default['default']('#' + element.attr('id') + '_confirmation').val();

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
      $__default['default'](currentElement).data('notLocallyUnique', true);
      return false;
    }

    if ($__default['default'](currentElement).data('notLocallyUnique')) {
      $__default['default'](currentElement).removeData('notLocallyUnique').data('changed', true);
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
      var otherValue = $__default['default'](this).val();

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

  $__default['default'].fn.disableClientSideValidations = function () {
    ClientSideValidations.disable(this);
    return this;
  };

  $__default['default'].fn.enableClientSideValidations = function () {
    var _this = this;

    var selectors = {
      forms: 'form',
      inputs: 'input'
    };

    var _loop = function _loop(selector) {
      var enablers = selectors[selector];

      _this.filter(ClientSideValidations.selectors[selector]).each(function () {
        return ClientSideValidations.enablers[enablers](this);
      });
    };

    for (var selector in selectors) {
      _loop(selector);
    }

    return this;
  };

  $__default['default'].fn.resetClientSideValidations = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      return ClientSideValidations.reset(this);
    });
    return this;
  };

  $__default['default'].fn.validate = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      return $__default['default'](this).enableClientSideValidations();
    });
    return this;
  };

  $__default['default'].fn.isValid = function (validators) {
    var obj = $__default['default'](this[0]);

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
    if (Object.prototype.hasOwnProperty.call(validators, elementName)) {
      return validators[elementName];
    }

    return validators[cleanElementName(elementName, validators)] || {};
  };

  var validateForm = function validateForm(form, validators) {
    var valid = true;
    form.trigger('form:validate:before.ClientSideValidations');
    form.find(ClientSideValidations.selectors.validate_inputs).each(function () {
      if (!$__default['default'](this).isValid(validators)) {
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
      if (!validatorFunctions[validator]) {
        continue;
      }

      if (!executeValidator(validatorFunctions, validatorFunctions[validator], validators[validator], element)) {
        return false;
      }
    }

    return true;
  };

  var isMarkedForDestroy = function isMarkedForDestroy(element) {
    if (element.attr('name').search(/\[([^\]]*?)\]$/) >= 0) {
      var destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]');

      if ($__default['default']("input[name='" + destroyInputName + "']").val() === '1') {
        return true;
      }
    }

    return false;
  };

  var executeAllValidators = function executeAllValidators(element, validators) {
    if (element.data('changed') === false || element.prop('disabled')) {
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

})));

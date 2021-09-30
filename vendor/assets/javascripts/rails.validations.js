/*!
 * Client Side Validations JS - v0.1.6 (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) 2021 Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ClientSideValidations = factory(global.jQuery));
})(this, (function (jQuery) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var jQuery__default = /*#__PURE__*/_interopDefaultLegacy(jQuery);

  var $$6 = require('../internals/export');
  var $filter = require('../internals/array-iteration').filter;
  var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  $$6({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var DESCRIPTORS$1 = require('../internals/descriptors');
  var FUNCTION_NAME_EXISTS = require('../internals/function-name').EXISTS;
  var defineProperty$1 = require('../internals/object-define-property').f;

  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (DESCRIPTORS$1 && !FUNCTION_NAME_EXISTS) {
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

  var $$5 = require('../internals/export');
  var exec = require('../internals/regexp-exec');

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  $$5({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
    exec: exec
  });

  var fixRegExpWellKnownSymbolLogic$2 = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject$3 = require('../internals/an-object');
  var toLength$1 = require('../internals/to-length');
  var toString$4 = require('../internals/to-string');
  var requireObjectCoercible$2 = require('../internals/require-object-coercible');
  var getMethod$2 = require('../internals/get-method');
  var advanceStringIndex$1 = require('../internals/advance-string-index');
  var regExpExec$2 = require('../internals/regexp-exec-abstract');

  // @@match logic
  fixRegExpWellKnownSymbolLogic$2('match', function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.es/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible$2(this);
        var matcher = regexp == undefined ? undefined : getMethod$2(regexp, MATCH);
        return matcher ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](toString$4(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
      function (string) {
        var rx = anObject$3(this);
        var S = toString$4(string);
        var res = maybeCallNative(nativeMatch, rx, S);

        if (res.done) return res.value;

        if (!rx.global) return regExpExec$2(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regExpExec$2(rx, S)) !== null) {
          var matchStr = toString$4(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var fixRegExpWellKnownSymbolLogic$1 = require('../internals/fix-regexp-well-known-symbol-logic');
  var fails$2 = require('../internals/fails');
  var anObject$2 = require('../internals/an-object');
  var isCallable = require('../internals/is-callable');
  var toInteger = require('../internals/to-integer');
  var toLength = require('../internals/to-length');
  var toString$3 = require('../internals/to-string');
  var requireObjectCoercible$1 = require('../internals/require-object-coercible');
  var advanceStringIndex = require('../internals/advance-string-index');
  var getMethod$1 = require('../internals/get-method');
  var getSubstitution = require('../internals/get-substitution');
  var regExpExec$1 = require('../internals/regexp-exec-abstract');
  var wellKnownSymbol$1 = require('../internals/well-known-symbol');

  var REPLACE = wellKnownSymbol$1('replace');
  var max = Math.max;
  var min = Math.min;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  var REPLACE_KEEPS_$0 = (function () {
    // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
    return 'a'.replace(/./, '$0') === '$0';
  })();

  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  })();

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$2(function () {
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
    return ''.replace(re, '$<a>') !== '7';
  });

  // @@replace logic
  fixRegExpWellKnownSymbolLogic$1('replace', function (_, nativeReplace, maybeCallNative) {
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

    return [
      // `String.prototype.replace` method
      // https://tc39.es/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible$1(this);
        var replacer = searchValue == undefined ? undefined : getMethod$1(searchValue, REPLACE);
        return replacer
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(toString$3(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
      function (string, replaceValue) {
        var rx = anObject$2(this);
        var S = toString$3(string);

        if (
          typeof replaceValue === 'string' &&
          replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
          replaceValue.indexOf('$<') === -1
        ) {
          var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
          if (res.done) return res.value;
        }

        var functionalReplace = isCallable(replaceValue);
        if (!functionalReplace) replaceValue = toString$3(replaceValue);

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

          var matchStr = toString$3(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = toString$3(result[0]);
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
            var replacement = toString$3(replaceValue.apply(undefined, replacerArgs));
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
  }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

  var $$4 = require('../internals/export');
  var $find = require('../internals/array-iteration').find;
  var addToUnscopables$1 = require('../internals/add-to-unscopables');

  var FIND = 'find';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  $$4({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables$1(FIND);

  var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject$1 = require('../internals/an-object');
  var requireObjectCoercible = require('../internals/require-object-coercible');
  var sameValue = require('../internals/same-value');
  var toString$2 = require('../internals/to-string');
  var getMethod = require('../internals/get-method');
  var regExpExec = require('../internals/regexp-exec-abstract');

  // @@search logic
  fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
    return [
      // `String.prototype.search` method
      // https://tc39.es/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible(this);
        var searcher = regexp == undefined ? undefined : getMethod(regexp, SEARCH);
        return searcher ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](toString$2(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
      function (string) {
        var rx = anObject$1(this);
        var S = toString$2(string);
        var res = maybeCallNative(nativeSearch, rx, S);

        if (res.done) return res.value;

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
        after: function after($element, eventData) {},
        before: function before($element, eventData) {},
        fail: function fail($element, message, addError, eventData) {
          return addError();
        },
        pass: function pass($element, removeError, eventData) {
          return removeError();
        }
      },
      form: {
        after: function after($form, eventData) {},
        before: function before($form, eventData) {},
        fail: function fail($form, eventData) {},
        pass: function pass($form, eventData) {}
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
            jQuery__default["default"](this).isValid(form.ClientSideValidations.settings.validators);
          },
          'change.ClientSideValidations': function changeClientSideValidations() {
            jQuery__default["default"](this).data('changed', true);
          },
          'element:validate:after.ClientSideValidations': function elementValidateAfterClientSideValidations(eventData) {
            ClientSideValidations.callbacks.element.after(jQuery__default["default"](this), eventData);
          },
          'element:validate:before.ClientSideValidations': function elementValidateBeforeClientSideValidations(eventData) {
            ClientSideValidations.callbacks.element.before(jQuery__default["default"](this), eventData);
          },
          'element:validate:fail.ClientSideValidations': function elementValidateFailClientSideValidations(eventData, message) {
            var $element = jQuery__default["default"](this);
            ClientSideValidations.callbacks.element.fail($element, message, function () {
              form.ClientSideValidations.addError($element, message);
            }, eventData);
          },
          'element:validate:pass.ClientSideValidations': function elementValidatePassClientSideValidations(eventData) {
            var $element = jQuery__default["default"](this);
            ClientSideValidations.callbacks.element.pass($element, function () {
              form.ClientSideValidations.removeError($element);
            }, eventData);
          }
        };
      },
      inputConfirmation: function inputConfirmation($element, form) {
        return {
          'focusout.ClientSideValidations': function focusoutClientSideValidations() {
            $element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
          },
          'keyup.ClientSideValidations': function keyupClientSideValidations() {
            $element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
          }
        };
      }
    },
    enablers: {
      form: function form(_form2) {
        var $form = jQuery__default["default"](_form2);
        _form2.ClientSideValidations = {
          settings: $form.data('clientSideValidations'),
          addError: function addError($element, message) {
            return ClientSideValidations.formBuilders[_form2.ClientSideValidations.settings.html_settings.type].add($element, _form2.ClientSideValidations.settings.html_settings, message);
          },
          removeError: function removeError($element) {
            return ClientSideValidations.formBuilders[_form2.ClientSideValidations.settings.html_settings.type].remove($element, _form2.ClientSideValidations.settings.html_settings);
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
        var $input = jQuery__default["default"](_input);
        var form = _input.form;
        var $form = jQuery__default["default"](form);
        var eventsToBind = ClientSideValidations.eventsToBind.input(form);

        for (var eventName in eventsToBind) {
          var eventFunction = eventsToBind[eventName];
          $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
            jQuery__default["default"](this).attr('data-validate', true);
          }).on(eventName, eventFunction);
        }

        $input.filter(':checkbox').on('change.ClientSideValidations', function () {
          jQuery__default["default"](this).isValid(form.ClientSideValidations.settings.validators);
        });
        $input.filter('[id$=_confirmation]').each(function () {
          var $element = jQuery__default["default"](this);
          var $elementToConfirm = $form.find("#" + this.id.match(/(.+)_confirmation/)[1] + ":input");

          if ($elementToConfirm.length) {
            var _eventsToBind = ClientSideValidations.eventsToBind.inputConfirmation($elementToConfirm, form);

            for (var _eventName in _eventsToBind) {
              var _eventFunction = _eventsToBind[_eventName];
              jQuery__default["default"]("#" + $element.attr('id')).on(_eventName, _eventFunction);
            }
          }
        });
      }
    },
    formBuilders: {
      'ActionView::Helpers::FormBuilder': {
        add: function add($element, settings, message) {
          var $form = jQuery__default["default"]($element[0].form);

          if ($element.data('valid') !== false && $form.find("label.message[for=\"" + $element.attr('id') + "\"]")[0] == null) {
            var $inputErrorField = jQuery__default["default"](settings.input_tag);
            var $labelErrorField = jQuery__default["default"](settings.label_tag);
            var $label = $form.find("label[for=\"" + $element.attr('id') + "\"]:not(.message)");

            if ($element.attr('autofocus')) {
              $element.attr('autofocus', false);
            }

            $element.before($inputErrorField);
            $inputErrorField.find('span#input_tag').replaceWith($element);
            $inputErrorField.find('label.message').attr('for', $element.attr('id'));
            $labelErrorField.find('label.message').attr('for', $element.attr('id'));
            $labelErrorField.insertAfter($label);
            $labelErrorField.find('label#label_tag').replaceWith($label);
          }

          $form.find("label.message[for=\"" + $element.attr('id') + "\"]").text(message);
        },
        remove: function remove($element, settings) {
          var $form = jQuery__default["default"]($element[0].form);
          var $inputErrorFieldClass = jQuery__default["default"](settings.input_tag).attr('class');
          var $inputErrorField = $element.closest("." + $inputErrorFieldClass.replace(/ /g, '.'));
          var $label = $form.find("label[for=\"" + $element.attr('id') + "\"]:not(.message)");
          var $labelErrorFieldClass = jQuery__default["default"](settings.label_tag).attr('class');
          var $labelErrorField = $label.closest("." + $labelErrorFieldClass.replace(/ /g, '.'));

          if ($inputErrorField[0]) {
            $inputErrorField.find("#" + $element.attr('id')).detach();
            $inputErrorField.replaceWith($element);
            $label.detach();
            $labelErrorField.replaceWith($label);
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
      validate_inputs: ':input:enabled:visible[data-validate]',
      forms: 'form[data-client-side-validations]'
    },
    validators: {
      all: function all() {
        return jQuery__default["default"].extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote);
      },
      local: {},
      remote: {}
    },
    disable: function disable(target) {
      var $target = jQuery__default["default"](target);
      $target.off('.ClientSideValidations');

      if ($target.is('form')) {
        ClientSideValidations.disable($target.find(':input'));
      } else {
        $target.removeData(['changed', 'valid']);
        $target.filter(':input').each(function () {
          jQuery__default["default"](this).removeAttr('data-validate');
        });
      }
    },
    reset: function reset(form) {
      var $form = jQuery__default["default"](form);
      ClientSideValidations.disable(form);

      for (var key in form.ClientSideValidations.settings.validators) {
        form.ClientSideValidations.removeError($form.find("[name=\"" + key + "\"]"));
      }

      ClientSideValidations.enablers.form(form);
    },
    start: function start() {
      if (window.Turbolinks != null && window.Turbolinks.supported) {
        var initializeOnEvent = window.Turbolinks.EVENTS != null ? 'page:change' : 'turbolinks:load';
        jQuery__default["default"](document).on(initializeOnEvent, function () {
          return jQuery__default["default"](ClientSideValidations.selectors.forms).validate();
        });
      } else {
        jQuery__default["default"](function () {
          return jQuery__default["default"](ClientSideValidations.selectors.forms).validate();
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
  var isValuePresent = function isValuePresent(value) {
    return !/^\s*$/.test(value || '');
  };

  var absenceLocalValidator = function absenceLocalValidator($element, options) {
    if (isValuePresent($element.val())) {
      return options.message;
    }
  };
  var presenceLocalValidator = function presenceLocalValidator($element, options) {
    if (!isValuePresent($element.val())) {
      return options.message;
    }
  };

  var DEFAULT_ACCEPT_OPTION = ['1', true];

  var isTextAccepted = function isTextAccepted(value, acceptOption) {
    if (!acceptOption) {
      acceptOption = DEFAULT_ACCEPT_OPTION;
    }

    if (Array.isArray(acceptOption)) {
      return arrayHasValue(value, acceptOption);
    }

    return value === acceptOption;
  };

  var acceptanceLocalValidator = function acceptanceLocalValidator($element, options) {
    var valid = true;

    if ($element.attr('type') === 'checkbox') {
      valid = $element.prop('checked');
    }

    if ($element.attr('type') === 'text') {
      valid = isTextAccepted($element.val(), options.accept);
    }

    if (!valid) {
      return options.message;
    }
  };

  var DESCRIPTORS = require('../internals/descriptors');
  var global = require('../internals/global');
  var isForced = require('../internals/is-forced');
  var inheritIfRequired = require('../internals/inherit-if-required');
  var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
  var defineProperty = require('../internals/object-define-property').f;
  var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
  var isRegExp = require('../internals/is-regexp');
  var toString$1 = require('../internals/to-string');
  var getFlags = require('../internals/regexp-flags');
  var stickyHelpers = require('../internals/regexp-sticky-helpers');
  var redefine$2 = require('../internals/redefine');
  var fails$1 = require('../internals/fails');
  var has = require('../internals/has');
  var enforceInternalState = require('../internals/internal-state').enforce;
  var setSpecies = require('../internals/set-species');
  var wellKnownSymbol = require('../internals/well-known-symbol');
  var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
  var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');

  var MATCH = wellKnownSymbol('match');
  var NativeRegExp = global.RegExp;
  var RegExpPrototype$1 = NativeRegExp.prototype;
  // TODO: Use only propper RegExpIdentifierName
  var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;

  var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

  var BASE_FORCED = DESCRIPTORS &&
    (!CORRECT_NEW || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails$1(function () {
      re2[MATCH] = false;
      // RegExp constructor can alter flags and IsRegExp works correct with @@match
      return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
    }));

  var handleDotAll = function (string) {
    var length = string.length;
    var index = 0;
    var result = '';
    var brackets = false;
    var chr;
    for (; index <= length; index++) {
      chr = string.charAt(index);
      if (chr === '\\') {
        result += chr + string.charAt(++index);
        continue;
      }
      if (!brackets && chr === '.') {
        result += '[\\s\\S]';
      } else {
        if (chr === '[') {
          brackets = true;
        } else if (chr === ']') {
          brackets = false;
        } result += chr;
      }
    } return result;
  };

  var handleNCG = function (string) {
    var length = string.length;
    var index = 0;
    var result = '';
    var named = [];
    var names = {};
    var brackets = false;
    var ncg = false;
    var groupid = 0;
    var groupname = '';
    var chr;
    for (; index <= length; index++) {
      chr = string.charAt(index);
      if (chr === '\\') {
        chr = chr + string.charAt(++index);
      } else if (chr === ']') {
        brackets = false;
      } else if (!brackets) switch (true) {
        case chr === '[':
          brackets = true;
          break;
        case chr === '(':
          if (IS_NCG.test(string.slice(index + 1))) {
            index += 2;
            ncg = true;
          }
          result += chr;
          groupid++;
          continue;
        case chr === '>' && ncg:
          if (groupname === '' || has(names, groupname)) {
            throw new SyntaxError('Invalid capture group name');
          }
          names[groupname] = true;
          named.push([groupname, groupid]);
          ncg = false;
          groupname = '';
          continue;
      }
      if (ncg) groupname += chr;
      else result += chr;
    } return [result, named];
  };

  // `RegExp` constructor
  // https://tc39.es/ecma262/#sec-regexp-constructor
  if (isForced('RegExp', BASE_FORCED)) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegExp(pattern);
      var flagsAreUndefined = flags === undefined;
      var groups = [];
      var rawPattern = pattern;
      var rawFlags, dotAll, sticky, handled, result, state;

      if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
        return pattern;
      }

      if (patternIsRegExp || pattern instanceof RegExpWrapper) {
        pattern = pattern.source;
        if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : getFlags.call(rawPattern);
      }

      pattern = pattern === undefined ? '' : toString$1(pattern);
      flags = flags === undefined ? '' : toString$1(flags);
      rawPattern = pattern;

      if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
        dotAll = !!flags && flags.indexOf('s') > -1;
        if (dotAll) flags = flags.replace(/s/g, '');
      }

      rawFlags = flags;

      if (UNSUPPORTED_Y && 'sticky' in re1) {
        sticky = !!flags && flags.indexOf('y') > -1;
        if (sticky) flags = flags.replace(/y/g, '');
      }

      if (UNSUPPORTED_NCG) {
        handled = handleNCG(pattern);
        pattern = handled[0];
        groups = handled[1];
      }

      result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);

      if (dotAll || sticky || groups.length) {
        state = enforceInternalState(result);
        if (dotAll) {
          state.dotAll = true;
          state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
        }
        if (sticky) state.sticky = true;
        if (groups.length) state.groups = groups;
      }

      if (pattern !== rawPattern) try {
        // fails in old engines, but we have no alternatives for unsupported regex syntax
        createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
      } catch (error) { /* empty */ }

      return result;
    };

    var proxy = function (key) {
      key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
        configurable: true,
        get: function () { return NativeRegExp[key]; },
        set: function (it) { NativeRegExp[key] = it; }
      });
    };

    for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
      proxy(keys[index++]);
    }

    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    redefine$2(global, 'RegExp', RegExpWrapper);
  }

  // https://tc39.es/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
  var redefine$1 = require('../internals/redefine');
  var anObject = require('../internals/an-object');
  var $toString = require('../internals/to-string');
  var fails = require('../internals/fails');
  var flags = require('../internals/regexp-flags');

  var TO_STRING = 'toString';
  var RegExpPrototype = RegExp.prototype;
  var nativeToString = RegExpPrototype[TO_STRING];

  var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name != TO_STRING;

  // `RegExp.prototype.toString` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine$1(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject(this);
      var p = $toString(R.source);
      var rf = R.flags;
      var f = $toString(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
      return '/' + p + '/' + f;
    }, { unsafe: true });
  }

  var isMatching = function isMatching(value, regExpOptions) {
    return new RegExp(regExpOptions.source, regExpOptions.options).test(value);
  };

  var hasValidFormat = function hasValidFormat(value, withOptions, withoutOptions) {
    return withOptions && isMatching(value, withOptions) || withoutOptions && !isMatching(value, withoutOptions);
  };

  var formatLocalValidator = function formatLocalValidator($element, options) {
    var value = $element.val();

    if (options.allow_blank && !isValuePresent(value)) {
      return;
    }

    if (!hasValidFormat(value, options.with, options.without)) {
      return options.message;
    }
  };

  var $$3 = require('../internals/export');
  var $parseInt = require('../internals/number-parse-int');

  // `parseInt` method
  // https://tc39.es/ecma262/#sec-parseint-string-radix
  $$3({ global: true, forced: parseInt != $parseInt }, {
    parseInt: $parseInt
  });

  var $$2 = require('../internals/export');
  var $parseFloat = require('../internals/number-parse-float');

  // `parseFloat` method
  // https://tc39.es/ecma262/#sec-parsefloat-string
  $$2({ global: true, forced: parseFloat != $parseFloat }, {
    parseFloat: $parseFloat
  });

  var $$1 = require('../internals/export');
  var $trim = require('../internals/string-trim').trim;
  var forcedStringTrimMethod = require('../internals/string-trim-forced');

  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  $$1({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
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
    },
    other_than: function other_than(a, b) {
      return parseFloat(a) !== parseFloat(b);
    }
  };

  var getOtherValue = function getOtherValue(validationOption, $form) {
    if (!isNaN(parseFloat(validationOption))) {
      return validationOption;
    }

    var validationElement = $form.find("[name*=\"" + validationOption + "\"]");

    if (validationElement.length === 1) {
      var numberFormat = $form[0].ClientSideValidations.settings.number_format;
      var otherFormattedValue = jQuery__default["default"].trim(validationElement.val()).replace(new RegExp("\\" + numberFormat.separator, 'g'), '.');

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

    if (!ClientSideValidations.patterns.numericality.default.test(formattedValue)) {
      return options.messages.numericality;
    }

    return runFunctionValidations(formattedValue, $form, options);
  };

  var numericalityLocalValidator = function numericalityLocalValidator($element, options) {
    var value = $element.val();

    if (options.allow_blank && !isValuePresent(value)) {
      return;
    }

    var $form = jQuery__default["default"]($element[0].form);
    var numberFormat = $form[0].ClientSideValidations.settings.number_format;
    var formattedValue = jQuery__default["default"].trim(value).replace(new RegExp("\\" + numberFormat.separator, 'g'), '.');
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

  var lengthLocalValidator = function lengthLocalValidator($element, options) {
    var value = $element.val();

    if (options.allow_blank && !isValuePresent(value)) {
      return;
    }

    return runValidations(value.length, options);
  };

  var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
  var redefine = require('../internals/redefine');
  var toString = require('../internals/object-to-string');

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!TO_STRING_TAG_SUPPORT) {
    redefine(Object.prototype, 'toString', toString, { unsafe: true });
  }

  var $ = require('../internals/export');
  var $includes = require('../internals/array-includes').includes;
  var addToUnscopables = require('../internals/add-to-unscopables');

  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  $({ target: 'Array', proto: true }, {
    includes: function includes(el /* , fromIndex = 0 */) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('includes');

  var isInList = function isInList(value, otherValues) {
    var normalizedOtherValues = [];

    for (var otherValueIndex in otherValues) {
      normalizedOtherValues.push(otherValues[otherValueIndex].toString());
    }

    return normalizedOtherValues.includes(value);
  };

  var isInRange = function isInRange(value, range) {
    return value >= range[0] && value <= range[1];
  };

  var isIncluded = function isIncluded(value, options, allowBlank) {
    if ((options.allow_blank && !isValuePresent(value)) === allowBlank) {
      return true;
    }

    return options.in && isInList(value, options.in) || options.range && isInRange(value, options.range);
  };

  var exclusionLocalValidator = function exclusionLocalValidator($element, options) {
    var value = $element.val();

    if (isIncluded(value, options, false) || !options.allow_blank && !isValuePresent(value)) {
      return options.message;
    }
  };
  var inclusionLocalValidator = function inclusionLocalValidator($element, options) {
    var value = $element.val();

    if (!isIncluded(value, options, true)) {
      return options.message;
    }
  };

  var confirmationLocalValidator = function confirmationLocalValidator($element, options) {
    var value = $element.val();
    var confirmationValue = jQuery__default["default"]("#" + $element.attr('id') + "_confirmation").val();

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
      jQuery__default["default"](currentElement).data('notLocallyUnique', true);
      return false;
    }

    if (jQuery__default["default"](currentElement).data('notLocallyUnique')) {
      jQuery__default["default"](currentElement).removeData('notLocallyUnique').data('changed', true);
    }

    return true;
  };

  var uniquenessLocalValidator = function uniquenessLocalValidator($element, options) {
    var elementName = $element.attr('name');
    var matches = elementName.match(/^(.+_attributes\])\[\d+\](.+)$/);

    if (!matches) {
      return;
    }

    var $form = jQuery__default["default"]($element[0].form);
    var value = $element.val();
    var valid = true;
    $form.find(":input[name^=\"" + matches[1] + "\"][name$=\"" + matches[2] + "\"]").not($element).each(function () {
      var otherValue = jQuery__default["default"](this).val();

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

  jQuery__default["default"].fn.disableClientSideValidations = function () {
    ClientSideValidations.disable(this);
    return this;
  };

  jQuery__default["default"].fn.enableClientSideValidations = function () {
    var _this = this;

    var selectors = {
      forms: 'form',
      inputs: 'input'
    };

    var _loop = function _loop(selector) {
      var enablers = selectors[selector];

      _this.filter(ClientSideValidations.selectors[selector]).each(function () {
        ClientSideValidations.enablers[enablers](this);
      });
    };

    for (var selector in selectors) {
      _loop(selector);
    }

    return this;
  };

  jQuery__default["default"].fn.resetClientSideValidations = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      ClientSideValidations.reset(this);
    });
    return this;
  };

  jQuery__default["default"].fn.validate = function () {
    this.filter(ClientSideValidations.selectors.forms).each(function () {
      jQuery__default["default"](this).enableClientSideValidations();
    });
    return this;
  };

  jQuery__default["default"].fn.isValid = function (validators) {
    var obj = jQuery__default["default"](this[0]);

    if (obj.is('form')) {
      return validateForm(obj, validators);
    } else {
      return validateElement(obj, validatorsFor(this[0].name, validators));
    }
  };

  var cleanNestedElementName = function cleanNestedElementName(elementName, nestedMatches, validators) {
    for (var validatorName in validators) {
      if (validatorName.match("\\[" + nestedMatches[1] + "\\].*\\[\\]\\[" + nestedMatches[2] + "\\]$")) {
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

  var validateForm = function validateForm($form, validators) {
    var valid = true;
    $form.trigger('form:validate:before.ClientSideValidations');
    $form.find(ClientSideValidations.selectors.validate_inputs).each(function () {
      if (!jQuery__default["default"](this).isValid(validators)) {
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

  var passElement = function passElement($element) {
    $element.trigger('element:validate:pass.ClientSideValidations').data('valid', null);
  };

  var failElement = function failElement($element, message) {
    $element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false);
  };

  var afterValidate = function afterValidate($element) {
    return $element.trigger('element:validate:after.ClientSideValidations').data('valid') !== false;
  };

  var executeValidator = function executeValidator(validatorFunctions, validatorFunction, validatorOptions, $element) {
    for (var validatorOption in validatorOptions) {
      if (!validatorOptions[validatorOption]) {
        continue;
      }

      var message = validatorFunction.call(validatorFunctions, $element, validatorOptions[validatorOption]);

      if (message) {
        failElement($element, message);
        return false;
      }
    }

    return true;
  };

  var executeValidators = function executeValidators(validatorFunctions, $element, validators) {
    for (var validator in validators) {
      if (!validatorFunctions[validator]) {
        continue;
      }

      if (!executeValidator(validatorFunctions, validatorFunctions[validator], validators[validator], $element)) {
        return false;
      }
    }

    return true;
  };

  var isMarkedForDestroy = function isMarkedForDestroy($element) {
    if ($element.attr('name').search(/\[([^\]]*?)\]$/) >= 0) {
      var destroyInputName = $element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]');

      if (jQuery__default["default"]("input[name=\"" + destroyInputName + "\"]").val() === '1') {
        return true;
      }
    }

    return false;
  };

  var executeAllValidators = function executeAllValidators($element, validators) {
    if ($element.data('changed') === false || $element.prop('disabled')) {
      return;
    }

    $element.data('changed', false);

    if (executeValidators(ClientSideValidations.validators.all(), $element, validators)) {
      passElement($element);
    }
  };

  var validateElement = function validateElement($element, validators) {
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
    return typeof exports === 'object' && typeof module !== 'undefined'; // eslint-disable-line no-undef
  }

  return ClientSideValidations;

}));

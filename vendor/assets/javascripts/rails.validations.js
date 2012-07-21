(function() {
  var $, validateElement, validateForm, validatorsFor,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  $.fn.validate = function() {
    return this.filter('form[data-validate]').each(function() {
      var addError, binding, event, form, removeError, settings, _ref, _ref1;
      form = $(this);
      settings = window.ClientSideValidations.forms[form.attr('id')];
      addError = function(element, message) {
        return ClientSideValidations.formBuilders[settings.type].add(element, settings, message);
      };
      removeError = function(element) {
        return ClientSideValidations.formBuilders[settings.type].remove(element, settings);
      };
      form.submit(function(eventData) {
        if (!form.isValid(settings.validators)) {
          return eventData.preventDefault();
        }
      });
      _ref = {
        'ajax:beforeSend': function(eventData) {
          if (eventData.target === this) {
            return form.isValid(settings.validators);
          }
        },
        'form:validate:after': function(eventData) {
          return ClientSideValidations.callbacks.form.after(form, eventData);
        },
        'form:validate:before': function(eventData) {
          return ClientSideValidations.callbacks.form.before(form, eventData);
        },
        'form:validate:fail': function(eventData) {
          return ClientSideValidations.callbacks.form.fail(form, eventData);
        },
        'form:validate:pass': function(eventData) {
          return ClientSideValidations.callbacks.form.pass(form, eventData);
        }
      };
      for (event in _ref) {
        binding = _ref[event];
        form.bind(event, binding);
      }
      _ref1 = {
        'focusout': function() {
          return $(this).isValid(settings.validators);
        },
        'change': function() {
          return $(this).data('changed', true);
        },
        'element:validate:after': function(eventData) {
          return ClientSideValidations.callbacks.element.after($(this), eventData);
        },
        'element:validate:before': function(eventData) {
          return ClientSideValidations.callbacks.element.before($(this), eventData);
        },
        'element:validate:fail': function(eventData, message) {
          var element;
          element = $(this);
          return ClientSideValidations.callbacks.element.fail(element, message, function() {
            return addError(element, message);
          }, eventData);
        },
        'element:validate:pass': function(eventData) {
          var element;
          element = $(this);
          return ClientSideValidations.callbacks.element.pass(element, function() {
            return removeError(element);
          }, eventData);
        }
      };
      for (event in _ref1) {
        binding = _ref1[event];
        form.find('[data-validate="true"]:input:enabled:not(:radio)').live(event, binding);
      }
      form.find('[data-validate="true"]:checkbox').live('click', function() {
        $(this).isValid(settings.validators);
        return true;
      });
      return form.find('[id*=_confirmation]').each(function() {
        var confirmationElement, element, _ref2, _results;
        confirmationElement = $(this);
        element = form.find("#" + (this.id.match(/(.+)_confirmation/)[1]) + "[data-validate='true']:input");
        if (element[0]) {
          _ref2 = {
            'focusout': function() {
              return element.data('changed', true).isValid(settings.validators);
            },
            'keyup': function() {
              return element.data('changed', true).isValid(settings.validators);
            }
          };
          _results = [];
          for (event in _ref2) {
            binding = _ref2[event];
            _results.push($("#" + (confirmationElement.attr('id'))).live(event, binding));
          }
          return _results;
        }
      });
    });
  };

  $.fn.isValid = function(validators) {
    var obj;
    obj = $(this[0]);
    if (obj.is('form')) {
      return validateForm(obj, validators);
    } else {
      return validateElement(obj, validatorsFor(this[0].name, validators));
    }
  };

  validatorsFor = function(name, validators) {
    name = name.replace(/_attributes\]\[\d+\]/g, "_attributes][]");
    return validators[name];
  };

  validateForm = function(form, validators) {
    var valid;
    form.trigger('form:validate:before');
    valid = true;
    form.find('[data-validate="true"]:input:enabled').each(function() {
      if (!$(this).isValid(validators)) {
        valid = false;
      }
      return true;
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
    var context, fn, kind, message, valid, validator, _i, _j, _len, _len1, _ref, _ref1;
    element.trigger('element:validate:before');
    if (element.data('changed') !== false) {
      valid = true;
      element.data('changed', false);
      context = ClientSideValidations.validators.local;
      for (kind in context) {
        fn = context[kind];
        if (validators[kind]) {
          _ref = validators[kind];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            validator = _ref[_i];
            if (message = fn.call(context, element, validator)) {
              element.trigger('element:validate:fail', message).data('valid', false);
              valid = false;
              break;
            }
          }
          if (!valid) {
            break;
          }
        }
      }
      if (valid) {
        context = ClientSideValidations.validators.remote;
        for (kind in context) {
          fn = context[kind];
          if (validators[kind]) {
            _ref1 = validators[kind];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              validator = _ref1[_j];
              if (message = fn.call(context, element, validator)) {
                element.trigger('element:validate:fail', message).data('valid', false);
                valid = false;
                break;
              }
            }
          }
          if (!valid) {
            break;
          }
        }
      }
      if (valid) {
        element.data('valid', null);
        element.trigger('element:validate:pass');
      }
    }
    element.trigger('element:validate:after');
    return element.data('valid') !== false;
  };

  $(function() {
    return $('form[data-validate]').validate();
  });

  window.ClientSideValidations = {
    forms: {},
    validators: {
      all: function() {
        return jQuery.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote);
      },
      local: {
        presence: function(element, options) {
          if (/^\s*$/.test(element.val() || '')) {
            return options.message;
          }
        },
        acceptance: function(element, options) {
          var _ref;
          switch (element.attr('type')) {
            case 'checkbox':
              if (!element.attr('checked')) {
                return options.message;
              }
              break;
            case 'text':
              if (element.val() !== (((_ref = options.accept) != null ? _ref.toString() : void 0) || '1')) {
                return options.message;
              }
          }
        },
        format: function(element, options) {
          var message;
          message = this.presence(element, options);
          if (message) {
            if (options.allow_blank === true) {
              return;
            }
            return message;
          }
          if (options["with"] && !options["with"].test(element.val())) {
            return options.message;
          }
          if (options.without && options.without.test(element.val())) {
            return options.message;
          }
        },
        numericality: function(element, options) {
          var CHECKS, check, check_value, fn, form, operator, val;
          val = jQuery.trim(element.val());
          if (!ClientSideValidations.patterns.numericality.test(val)) {
            if (options.allow_blank === true) {
              return;
            }
            return options.messages.numericality;
          }
          if (options.only_integer && !/^[+-]?\d+$/.test(val)) {
            return options.messages.only_integer;
          }
          CHECKS = {
            greater_than: '>',
            greater_than_or_equal_to: '>=',
            equal_to: '==',
            less_than: '<',
            less_than_or_equal_to: '<='
          };
          form = $(element[0].form);
          for (check in CHECKS) {
            operator = CHECKS[check];
            if (!(options[check] != null)) {
              continue;
            }
            if (!isNaN(parseFloat(options[check])) && isFinite(options[check])) {
              check_value = options[check];
            } else if (form.find("[name*=" + options[check] + "]").size() === 1) {
              check_value = form.find("[name*=" + options[check] + "]").val();
            } else {
              return;
            }
            fn = new Function("return " + val + " " + operator + " " + check_value);
            if (!fn()) {
              return options.messages[check];
            }
          }
          if (options.odd && !(parseInt(val, 10) % 2)) {
            return options.messages.odd;
          }
          if (options.even && (parseInt(val, 10) % 2)) {
            return options.messages.even;
          }
        },
        length: function(element, options) {
          var CHECKS, blankOptions, check, fn, message, operator, tokenized_length, tokenizer;
          tokenizer = options.js_tokenizer || "split('')";
          tokenized_length = new Function('element', "return (element.val()." + tokenizer + " || '').length")(element);
          CHECKS = {
            is: '==',
            minimum: '>=',
            maximum: '<='
          };
          blankOptions = {};
          blankOptions.message = options.is ? options.messages.is : options.minimum ? options.messages.minimum : void 0;
          message = this.presence(element, blankOptions);
          if (message) {
            if (options.allow_blank === true) {
              return;
            }
            return message;
          }
          for (check in CHECKS) {
            operator = CHECKS[check];
            if (!options[check]) {
              continue;
            }
            fn = new Function("return " + tokenized_length + " " + operator + " " + options[check]);
            if (!fn()) {
              return options.messages[check];
            }
          }
        },
        exclusion: function(element, options) {
          var lower, message, o, upper, _ref;
          message = this.presence(element, options);
          if (message) {
            if (options.allow_blank === true) {
              return;
            }
            return message;
          }
          if (options["in"]) {
            if (_ref = element.val(), __indexOf.call((function() {
              var _i, _len, _ref1, _results;
              _ref1 = options["in"];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                o = _ref1[_i];
                _results.push(o.toString());
              }
              return _results;
            })(), _ref) >= 0) {
              return options.message;
            }
          }
          if (options.range) {
            lower = options.range[0];
            upper = options.range[1];
            if (element.val() >= lower && element.val() <= upper) {
              return options.message;
            }
          }
        },
        inclusion: function(element, options) {
          var lower, message, o, upper, _ref;
          message = this.presence(element, options);
          if (message) {
            if (options.allow_blank === true) {
              return;
            }
            return message;
          }
          if (options["in"]) {
            if (_ref = element.val(), __indexOf.call((function() {
              var _i, _len, _ref1, _results;
              _ref1 = options["in"];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                o = _ref1[_i];
                _results.push(o.toString());
              }
              return _results;
            })(), _ref) >= 0) {
              return;
            }
            return options.message;
          }
          if (options.range) {
            lower = options.range[0];
            upper = options.range[1];
            if (element.val() >= lower && element.val() <= upper) {
              return;
            }
            return options.message;
          }
        },
        confirmation: function(element, options) {
          if (element.val() !== jQuery("#" + (element.attr('id')) + "_confirmation").val()) {
            return options.message;
          }
        },
        uniqueness: function(element, options) {
          var form, matches, name, name_prefix, name_suffix, valid, value;
          name = element.attr('name');
          if (/_attributes\]\[\d/.test(name)) {
            matches = name.match(/^(.+_attributes\])\[\d+\](.+)$/);
            name_prefix = matches[1];
            name_suffix = matches[2];
            value = element.val();
            if (name_prefix && name_suffix) {
              form = element.closest('form');
              valid = true;
              form.find(':input[name^="' + name_prefix + '"][name$="' + name_suffix + '"]').each(function() {
                if ($(this).attr('name') !== name) {
                  if ($(this).val() === value) {
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
            }
          }
        }
      },
      remote: {
        uniqueness: function(element, options) {
          var data, key, message, name, scope_value, scoped_element, scoped_name, _ref;
          message = ClientSideValidations.validators.local.presence(element, options);
          if (message) {
            if (options.allow_blank === true) {
              return;
            }
            return message;
          }
          data = {};
          data.case_sensitive = !!options.case_sensitive;
          if (options.id) {
            data.id = options.id;
          }
          if (options.scope) {
            data.scope = {};
            _ref = options.scope;
            for (key in _ref) {
              scope_value = _ref[key];
              scoped_name = element.attr('name').replace(/\[\w+\]$/, "[" + key + "]");
              scoped_element = jQuery("[name='" + scoped_name + "']");
              if (scoped_element[0] && scoped_element.val() !== scope_value) {
                data.scope[key] = scoped_element.val();
                scoped_element.unbind("change." + element.id).bind("change." + element.id, function() {
                  element.trigger('change');
                  return element.trigger('focusout');
                });
              } else {
                data.scope[key] = scope_value;
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
            name = options['class'] + '[' + name.split('[')[1];
          }
          data[name] = element.val();
          if (jQuery.ajax({
            url: '/validators/uniqueness',
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
          var form, inputErrorField, label, labelErrorField;
          form = $(element[0].form);
          if (element.data('valid') !== false && !(form.find("label.message[for='" + (element.attr('id')) + "']")[0] != null)) {
            inputErrorField = jQuery(settings.input_tag);
            labelErrorField = jQuery(settings.label_tag);
            label = form.find("label[for='" + (element.attr('id')) + "']:not(.message)");
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
          return form.find("label.message[for='" + (element.attr('id')) + "']").text(message);
        },
        remove: function(element, settings) {
          var errorFieldClass, form, inputErrorField, label, labelErrorField;
          form = $(element[0].form);
          errorFieldClass = jQuery(settings.input_tag).attr('class');
          inputErrorField = element.closest("." + (errorFieldClass.replace(" ", ".")));
          label = form.find("label[for='" + (element.attr('id')) + "']:not(.message)");
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
    patterns: {
      numericality: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/
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

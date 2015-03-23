(function() {
  var $, validateElement, validateForm, validatorsFor,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  $.fn.disableClientSideValidations = function() {
    ClientSideValidations.disable(this);
    return this;
  };

  $.fn.enableClientSideValidations = function() {
    this.filter(ClientSideValidations.selectors.forms).each(function() {
      return ClientSideValidations.enablers.form(this);
    });
    this.filter(ClientSideValidations.selectors.inputs).each(function() {
      return ClientSideValidations.enablers.input(this);
    });
    return this;
  };

  $.fn.resetClientSideValidations = function() {
    this.filter(ClientSideValidations.selectors.forms).each(function() {
      return ClientSideValidations.reset(this);
    });
    return this;
  };

  $.fn.validate = function() {
    this.filter(ClientSideValidations.selectors.forms).each(function() {
      return $(this).enableClientSideValidations();
    });
    return this;
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
    var captures, validator, validator_name;
    if (captures = name.match(/\[(\w+_attributes)\].*\[(\w+)\]$/)) {
      for (validator_name in validators) {
        validator = validators[validator_name];
        if (validator_name.match("\\[" + captures[1] + "\\].*\\[\\]\\[" + captures[2] + "\\]$")) {
          name = name.replace(/\[[\da-z_]+\]\[(\w+)\]$/g, "[][$1]");
        }
      }
    }
    return validators[name] || {};
  };

  validateForm = function(form, validators) {
    var valid;
    form.trigger('form:validate:before.ClientSideValidations');
    valid = true;
    form.find(ClientSideValidations.selectors.validate_inputs).each(function() {
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

  validateElement = function(element, validators) {
    var afterValidate, destroyInputName, executeValidators, failElement, local, passElement, remote;
    element.trigger('element:validate:before.ClientSideValidations');
    passElement = function() {
      return element.trigger('element:validate:pass.ClientSideValidations').data('valid', null);
    };
    failElement = function(message) {
      element.trigger('element:validate:fail.ClientSideValidations', message).data('valid', false);
      return false;
    };
    afterValidate = function() {
      return element.trigger('element:validate:after.ClientSideValidations').data('valid') !== false;
    };
    executeValidators = function(context) {
      var fn, i, kind, len, message, ref, valid, validator;
      valid = true;
      for (kind in context) {
        fn = context[kind];
        if (validators[kind]) {
          ref = validators[kind];
          for (i = 0, len = ref.length; i < len; i++) {
            validator = ref[i];
            if (message = fn.call(context, element, validator)) {
              valid = failElement(message);
              break;
            }
          }
          if (!valid) {
            break;
          }
        }
      }
      return valid;
    };
    destroyInputName = element.attr('name').replace(/\[([^\]]*?)\]$/, '[_destroy]');
    if ($("input[name='" + destroyInputName + "']").val() === "1") {
      passElement();
      return afterValidate();
    }
    if (element.data('changed') === false) {
      return afterValidate();
    }
    element.data('changed', false);
    local = ClientSideValidations.validators.local;
    remote = ClientSideValidations.validators.remote;
    if (executeValidators(local) && executeValidators(remote)) {
      passElement();
    }
    return afterValidate();
  };

  if (window.ClientSideValidations === void 0) {
    window.ClientSideValidations = {};
  }

  if (window.ClientSideValidations.forms === void 0) {
    window.ClientSideValidations.forms = {};
  }

  window.ClientSideValidations.selectors = {
    inputs: ':input:not(button):not([type="submit"])[name]:visible:enabled',
    validate_inputs: ':input:enabled:visible[data-validate]',
    forms: 'form[data-validate]'
  };

  window.ClientSideValidations.reset = function(form) {
    var $form, key;
    $form = $(form);
    ClientSideValidations.disable(form);
    for (key in form.ClientSideValidations.settings.validators) {
      form.ClientSideValidations.removeError($form.find("[name='" + key + "']"));
    }
    return ClientSideValidations.enablers.form(form);
  };

  window.ClientSideValidations.disable = function(target) {
    var $target;
    $target = $(target);
    $target.off('.ClientSideValidations');
    if ($target.is('form')) {
      return ClientSideValidations.disable($target.find(':input'));
    } else {
      $target.removeData('valid');
      $target.removeData('changed');
      return $target.filter(':input').each(function() {
        return $(this).removeAttr('data-validate');
      });
    }
  };

  window.ClientSideValidations.enablers = {
    form: function(form) {
      var $form, binding, event, ref;
      $form = $(form);
      form.ClientSideValidations = {
        settings: window.ClientSideValidations.forms[$form.attr('id')],
        addError: function(element, message) {
          return ClientSideValidations.formBuilders[form.ClientSideValidations.settings.type].add(element, form.ClientSideValidations.settings, message);
        },
        removeError: function(element) {
          return ClientSideValidations.formBuilders[form.ClientSideValidations.settings.type].remove(element, form.ClientSideValidations.settings);
        }
      };
      ref = {
        'submit.ClientSideValidations': function(eventData) {
          if (!$form.isValid(form.ClientSideValidations.settings.validators)) {
            eventData.preventDefault();
            return eventData.stopImmediatePropagation();
          }
        },
        'ajax:beforeSend.ClientSideValidations': function(eventData) {
          if (eventData.target === this) {
            return $form.isValid(form.ClientSideValidations.settings.validators);
          }
        },
        'form:validate:after.ClientSideValidations': function(eventData) {
          return ClientSideValidations.callbacks.form.after($form, eventData);
        },
        'form:validate:before.ClientSideValidations': function(eventData) {
          return ClientSideValidations.callbacks.form.before($form, eventData);
        },
        'form:validate:fail.ClientSideValidations': function(eventData) {
          return ClientSideValidations.callbacks.form.fail($form, eventData);
        },
        'form:validate:pass.ClientSideValidations': function(eventData) {
          return ClientSideValidations.callbacks.form.pass($form, eventData);
        }
      };
      for (event in ref) {
        binding = ref[event];
        $form.on(event, binding);
      }
      return $form.find(ClientSideValidations.selectors.inputs).each(function() {
        return ClientSideValidations.enablers.input(this);
      });
    },
    input: function(input) {
      var $form, $input, binding, event, form, ref;
      $input = $(input);
      form = input.form;
      $form = $(form);
      ref = {
        'focusout.ClientSideValidations': function() {
          return $(this).isValid(form.ClientSideValidations.settings.validators);
        },
        'change.ClientSideValidations': function() {
          return $(this).data('changed', true);
        },
        'element:validate:after.ClientSideValidations': function(eventData) {
          return ClientSideValidations.callbacks.element.after($(this), eventData);
        },
        'element:validate:before.ClientSideValidations': function(eventData) {
          return ClientSideValidations.callbacks.element.before($(this), eventData);
        },
        'element:validate:fail.ClientSideValidations': function(eventData, message) {
          var element;
          element = $(this);
          return ClientSideValidations.callbacks.element.fail(element, message, function() {
            return form.ClientSideValidations.addError(element, message);
          }, eventData);
        },
        'element:validate:pass.ClientSideValidations': function(eventData) {
          var element;
          element = $(this);
          return ClientSideValidations.callbacks.element.pass(element, function() {
            return form.ClientSideValidations.removeError(element);
          }, eventData);
        }
      };
      for (event in ref) {
        binding = ref[event];
        $input.filter(':not(:radio):not([id$=_confirmation])').each(function() {
          return $(this).attr('data-validate', true);
        }).on(event, binding);
      }
      $input.filter(':checkbox').on('change.ClientSideValidations', function() {
        return $(this).isValid(form.ClientSideValidations.settings.validators);
      });
      return $input.filter('[id$=_confirmation]').each(function() {
        var confirmationElement, element, ref1, results;
        confirmationElement = $(this);
        element = $form.find("#" + (this.id.match(/(.+)_confirmation/)[1]) + ":input");
        if (element[0]) {
          ref1 = {
            'focusout.ClientSideValidations': function() {
              return element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
            },
            'keyup.ClientSideValidations': function() {
              return element.data('changed', true).isValid(form.ClientSideValidations.settings.validators);
            }
          };
          results = [];
          for (event in ref1) {
            binding = ref1[event];
            results.push($("#" + (confirmationElement.attr('id'))).on(event, binding));
          }
          return results;
        }
      });
    }
  };

  window.ClientSideValidations.validators = {
    all: function() {
      return jQuery.extend({}, ClientSideValidations.validators.local, ClientSideValidations.validators.remote);
    },
    local: {
      absence: function(element, options) {
        if (!/^\s*$/.test(element.val() || '')) {
          return options.message;
        }
      },
      presence: function(element, options) {
        if (/^\s*$/.test(element.val() || '')) {
          return options.message;
        }
      },
      acceptance: function(element, options) {
        var ref;
        switch (element.attr('type')) {
          case 'checkbox':
            if (!element.prop('checked')) {
              return options.message;
            }
            break;
          case 'text':
            if (element.val() !== (((ref = options.accept) != null ? ref.toString() : void 0) || '1')) {
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
        if (options["with"] && !new RegExp(options["with"].source, options["with"].options).test(element.val())) {
          return options.message;
        }
        if (options.without && !new RegExp(options.without.source, options.without.options).test(element.val())) {
          return options.message;
        }
      },
      numericality: function(element, options) {
        var CHECKS, check, check_value, fn, form, operator, val;
        val = jQuery.trim(element.val());
        if (!ClientSideValidations.patterns.numericality.test(val)) {
          if (options.allow_blank === true && this.presence(element, {
            message: options.messages.numericality
          })) {
            return;
          }
          return options.messages.numericality;
        }
        val = val.replace(new RegExp("\\" + ClientSideValidations.number_format.delimiter, 'g'), "").replace(new RegExp("\\" + ClientSideValidations.number_format.separator, 'g'), ".");
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
        var lower, message, option, ref, upper;
        message = this.presence(element, options);
        if (message) {
          if (options.allow_blank === true) {
            return;
          }
          return message;
        }
        if (options["in"]) {
          if (ref = element.val(), indexOf.call((function() {
            var i, len, ref1, results;
            ref1 = options["in"];
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              option = ref1[i];
              results.push(option.toString());
            }
            return results;
          })(), ref) >= 0) {
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
        var lower, message, option, ref, upper;
        message = this.presence(element, options);
        if (message) {
          if (options.allow_blank === true) {
            return;
          }
          return message;
        }
        if (options["in"]) {
          if (ref = element.val(), indexOf.call((function() {
            var i, len, ref1, results;
            ref1 = options["in"];
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              option = ref1[i];
              results.push(option.toString());
            }
            return results;
          })(), ref) >= 0) {
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
        var data, key, message, name, ref, scope_value, scoped_element, scoped_name;
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
          ref = options.scope;
          for (key in ref) {
            scope_value = ref[key];
            scoped_name = element.attr('name').replace(/\[\w+\]$/, "[" + key + "]");
            scoped_element = jQuery("[name='" + scoped_name + "']");
            jQuery("[name='" + scoped_name + "']:checkbox").each(function() {
              if (this.checked) {
                return scoped_element = this;
              }
            });
            if (scoped_element[0] && scoped_element.val() !== scope_value) {
              data.scope[key] = scoped_element.val();
              scoped_element.unbind("change." + element.id).bind("change." + element.id, function() {
                element.trigger('change.ClientSideValidations');
                return element.trigger('focusout.ClientSideValidations');
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
          url: ClientSideValidations.remote_validators_url_for('uniqueness'),
          data: data,
          async: false,
          cache: false
        }).status === 200) {
          return options.message;
        }
      }
    }
  };

  window.ClientSideValidations.remote_validators_url_for = function(validator) {
    if (ClientSideValidations.remote_validators_prefix != null) {
      return "//" + window.location.host + "/" + ClientSideValidations.remote_validators_prefix + "/validators/" + validator;
    } else {
      return "//" + window.location.host + "/validators/" + validator;
    }
  };

  window.ClientSideValidations.disableValidators = function() {
    var func, ref, results, validator;
    if (window.ClientSideValidations.disabled_validators === void 0) {
      return;
    }
    ref = window.ClientSideValidations.validators.remote;
    results = [];
    for (validator in ref) {
      func = ref[validator];
      if (indexOf.call(window.ClientSideValidations.disabled_validators, validator) >= 0) {
        results.push(delete window.ClientSideValidations.validators.remote[validator]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  window.ClientSideValidations.formBuilders = {
    'ActionView::Helpers::FormBuilder': {
      add: function(element, settings, message) {
        var form, inputErrorField, label, labelErrorField;
        form = $(element[0].form);
        if (element.data('valid') !== false && (form.find("label.message[for='" + (element.attr('id')) + "']")[0] == null)) {
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
        inputErrorField = element.closest("." + (errorFieldClass.replace(/\ /g, ".")));
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
  };

  window.ClientSideValidations.patterns = {
    numericality: /^(-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/
  };

  window.ClientSideValidations.callbacks = {
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
  };

  $(document).bind((window.Turbolinks ? 'page:change' : 'ready'), function() {
    ClientSideValidations.disableValidators();
    return $(ClientSideValidations.selectors.forms).validate();
  });

}).call(this);

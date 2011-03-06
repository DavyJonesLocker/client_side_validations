$(document).ready(function() {
  $('[data-validate]').live('submit', function() {
    return clientSideValidations.validateForm(this);
  });

  // Find first version of IE where reapplySelectionAndFocus works
  var userAgent = $.browser;
  if (!userAgent.msie) {
    $('[data-validators][data-failed-once]').live('keyup', function() {
      if (this.type != 'checkbox') {
        clientSideValidations.validateSelector(this, this.selectionStart, this.selectionEnd);
      }
    });
  }

  $('[id*=_confirmation]').each(function() {
    if (relatedElement = document.getElementById((this.id.match(/(.+)_confirmation/)[1]))) {
      $('#'+this.id).live('keyup', function() {
        clientSideValidations.validateSelector(relatedElement);
      });
    }
  });

  $('[data-validators]').live('blur', function() {
    clientSideValidations.validateSelector(this);
  });

  $('[id*=_confirmation]').each(function() {
    if (relatedElement = document.getElementById((this.id.match(/(.+)_confirmation/)[1]))) {
      $('#'+this.id).live('blur', function() {
        clientSideValidations.validateSelector(relatedElement);
      });
    }
  });

  $('[data-validators][type="checkbox"]').live('click', function() {
    clientSideValidations.validateSelector(this, 'checkbox');
  });
});

var clientSideValidations = new function() {

  this.validateForm = function(form) {
    var validForm = true;

    for (var i = 0, selector; selector = $(form).find('[data-validators]')[i]; i++) {
      if (!this.validateSelector(selector)) { validForm = false }
    }

    return validForm;
  }

  this.validateSelector = function(selector, selectionStart, selectionEnd) {
    var selector = $(selector);
    var validSelector = true;

    this.detachErrorField(selector, selectionStart, selectionEnd);
    eval('var validators = ' + selector.attr('data-validators'));

    for (var key in validators) {
      if (this.validator[key] && (message = this.validator[key](validators[key], selector))) {
        this.applyErrorField(selector, message, selectionStart, selectionEnd);
        validSelector = false;
        break;
      }
    }

    return validSelector;
  }

  this.detachErrorField = function(selector, selectionStart, selectionEnd) {
    var inputErrorField = $('#' + selector.attr('id') + '_error');
    var label = $('label[for="' + selector.attr('id') + '"]:not(.message)');
    var labelErrorField = label.parent();

    if (inputErrorField[0]) {
      $('[data-validators]').die('blur');
      inputErrorField.find('#' + selector.attr('id')).detach();
      inputErrorField.replaceWith(selector);
      $('[data-validators]').live('blur', function() { clientSideValidations.validateSelector(this) });
      this.reapplySelectionAndFocus(selector, selectionStart, selectionEnd);
      label.detach();
      labelErrorField.replaceWith(label);
    }
  }

  this.applyErrorField = function(selector, message, selectionStart, selectionEnd) {
    var inputErrorField = $(inputFieldErrorPartial);
    var labelErrorField = $(labelFieldErrorPartial);
    var label = $('label[for="' + selector.attr('id') + '"]:not(.message)');

    // Killing the live event then re-enabling them is probably not very performant
    $('[data-validators]').die('blur');
    selector.replaceWith(inputErrorField);
    selector.attr('data-failed-once', true);
    inputErrorField.find('span#input_tag').replaceWith(selector);
    inputErrorField.find('label.message').text(message);
    inputErrorField.find('label.message').attr('for', selector.attr('id'));
    inputErrorField.attr('id', selector.attr('id') + '_error');

    label.replaceWith(labelErrorField);
    labelErrorField.find('label#label_tag').replaceWith(label);

    $('[data-validators]').live('blur', function() { clientSideValidations.validateSelector(this) });
    this.reapplySelectionAndFocus(selector, selectionStart, selectionEnd);
  }

  this.validator = {
    acceptance: function(validator, selector) {
      switch (selector.attr('type')) {
        case 'checkbox':
          if (!selector.attr('checked')) {
            return validator.message;
          }
          break;
        case 'text':
          if (selector.val() != (validator.accept || '1')) {
            return validator.message;
          }
          break;
      }
    },
    format: function(validator, selector) {
      if (message = this.presence(validator, selector) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        if (validator['with'] && !validator['with'].test(selector.val())) {
          return validator.message;
        } else if (validator['without'] && validator['without'].test(selector.val())) {
          return validator.message;
        }
      }
    },
    presence: function(validator, selector) {
      if (/^\s*$/.test(selector.val())) {
        return validator.message;
      }
    },
    numericality: function(validator, selector) {
      if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(selector.val())) {
        return validator.messages.numericality;
      }

      if (validator.only_integer && !/^\d+$/.test(selector.val())) {
        return validator.messages.only_integer;
      }

      var CHECKS = { greater_than: '>', greater_than_or_equal_to: '>=',
        equal_to: '==', less_than: '<', less_than_or_equal_to: '<=' }

      for (var check in CHECKS) {
        if (validator[check] && !eval(selector.val() + CHECKS[check] + validator[check])) {
          return validator.messages[check];
        }
      }

      if (validator.odd && !(parseInt(selector.val()) % 2)) {
        return validator.messages.odd;
      }

      if (validator.even && (parseInt(selector.val()) % 2)) {
        return validator.messages.even;
      }
    },
    length: function(validator, selector) {
      if (message = this.presence(validator, selector) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        var CHECKS = { is: '==', minimum: '>=', maximum: '<=' }
        var tokenizer = validator.js_tokenizer || "split('')";
        var tokenized_length = eval("(selector.val()." + tokenizer + " || '').length");

        for (var check in CHECKS) {
          if (validator[check] && !eval(tokenized_length + CHECKS[check] + validator[check])) {
            return validator.messages[check];
          }
        }
      }
    },
    confirmation: function(validator, selector) {
      if (selector.val() != $('#' + selector.attr('id') + '_confirmation').val()) {
        return validator.message;
      }
    },
    exclusion: function(validator, selector) {
      if (message = this.presence(validator, selector) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        for (var i = 0; i < validator['in'].length; i++) {
          if (validator['in'][i] == selector.val()) {
            return validator.message;
          }
        }
      }
    },
    inclusion: function(validator, selector) {
      if (message = this.presence(validator, selector) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        for (var i = 0; i < validator['in'].length; i++) {
          if (validator['in'][i] == selector.val()) {
            return;
          }
        }
        return validator.message;
      }
    },
    uniqueness: function(validator, selector) {
      if (message = this.presence(validator, selector) && validator.allow_blank == true) {
        return;
      } else if (message) {
        return message;
      } else {
        var data = {};
        data['case_sensitive'] = !!validator.case_sensitive;
        data[selector.attr('name')] = selector.val();
        var response = $.ajax({
          url: '/validators/uniqueness.json',
          data: data,
          async: false
        }).responseText;
        if (!$.parseJSON(response)) {
          return validator.message;
        }
      }
    }
  }

  this.reapplySelectionAndFocus = function(selector, selectionStart, selectionEnd) {
    if (typeof(selectionStart) != "undefined" && typeof(selectionEnd) != "undefined") {
      selector[0].setSelectionRange(selectionStart, selectionEnd);
      selector[0].focus();
    } else if (selectionStart == 'checkbox') {
      selector[0].focus();
    }
  }
}


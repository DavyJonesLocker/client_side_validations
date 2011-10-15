module('Element Validate Fail Callback', {
  setup: function() {
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {"user[name]":{"presence":{"message": "must be present"}}}
    }

    $('#qunit-fixture')
      .append($('<span id="result" />'))
      .append($('<form />', {
        action: '/users',
        'data-validate': true,
        method: 'post',
        id: 'new_user'
      }))
      .find('form')
        .append($('<input />', {
          name: 'user[name]',
          id: 'user_name',
          'data-validate': 'true',
          type: 'text'
        }))
        .append($('<label for="user_name">Name</label>'));

    ClientSideValidations.callbacks.element.fail = function(element, message) {
      $('#result').text('Element Validate Fail ' + element.attr('id') + ' ' + message);
    }
    $('form#new_user').validate();
  },
  teardown: function() {
    ClientSideValidations.callbacks.element.fail = function(element, message, callback) { callback(); }
  }
});

test('runs callback when form element validate', function() {
  var input = $('input');

  equal($('#result').text(), '');

  input.val('test')
  input.trigger('change');
  input.trigger('focusout');
  equal($('#result').text(), '');

  input.val('')
  input.trigger('change');
  input.trigger('focusout');
  equal($('#result').text(), 'Element Validate Fail user_name must be present');
});

test('runs callback when form validates', function() {
  var form = $('form'), input = form.find('input');

  equal($('#result').text(), '');

  input.val('test')
  input.trigger('change');
  form.trigger('submit');

  equal($('#result').text(), '');

  input.val('')
  input.trigger('change');
  form.trigger('submit');

  equal($('#result').text(), 'Element Validate Fail user_name must be present');
});


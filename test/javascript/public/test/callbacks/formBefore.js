module('Form Validate Before Callback', {
  setup: function() {
    window['clientSideValidations']['forms']['new_user'] = {
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

    clientSideValidations.callbacks.form.before = function(form, message) {
      $('#result').text('Form Validate Before ' + form.attr('id'));
    }
    $('form#new_user').validate();
  },
  teardown: function() {
    clientSideValidations.callbacks.form.before = function(form, eventData) {}
  }
});

test('runs callback', function() {
  var form = $('form'), input = form.find('input');

  equal($('#result').text(), '');

  form.submit();
  equal($('#result').text(), 'Form Validate Before new_user');
});


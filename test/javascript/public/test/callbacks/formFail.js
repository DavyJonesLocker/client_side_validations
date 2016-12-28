QUnit.module('Form Validate Fail Callback', {
  beforeEach: function() {
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {"user[name]":{"presence":[{"message": "must be present"}]}}
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
          type: 'text'
        }))
        .append($('<label for="user_name">Name</label>'));

    ClientSideValidations.callbacks.form.fail = function(form, message) {
      $('#result').text('Form Validate Fail ' + form.attr('id'));
    }
    $('form#new_user').validate();
  },
  afterEach: function() {
    ClientSideValidations.callbacks.form.fail = function(form, eventData) {}
  }
});

QUnit.test('runs callback', function(assert) {
  var form = $('form'), input = form.find('input');

  assert.equal($('#result').text(), '');

  form.submit();
  assert.equal($('#result').text(), 'Form Validate Fail new_user');

  $('#result').text('');
  input.val('test');
  input.trigger('change');
  form.submit();
  assert.equal($('#result').text(), '');
});

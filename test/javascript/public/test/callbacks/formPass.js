QUnit.module('Form Validate Pass Callback', {
  beforeEach: function() {
    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>'
      },
      validators: {"user[name]":{"presence":[{"message": "must be present"}]}}
    }

    $('#qunit-fixture')
      .append($('<span id="result" />'))
      .append($('<form />', {
        action: '/users',
        'data-client-side-validations': JSON.stringify(dataCsv),
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

    ClientSideValidations.callbacks.form.pass = function(form, message) {
      $('#result').text('Form Validate Pass ' + form.attr('id'));
    }
    $('form#new_user').validate();
  },
  afterEach: function() {
    ClientSideValidations.callbacks.form.pass = function(form, eventData) {}
  }
});

QUnit.test('runs callback', function(assert) {
  var form = $('#new_user'), input = form.find('input');

  assert.equal($('#result').text(), '');

  form.submit();
  assert.equal($('#result').text(), '');

  input.val('test');
  input.trigger('change');
  form.submit();
  assert.equal($('#result').text(), 'Form Validate Pass new_user');
});

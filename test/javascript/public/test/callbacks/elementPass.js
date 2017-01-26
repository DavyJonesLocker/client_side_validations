QUnit.module('Element Validate Pass Callback', {
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

    ClientSideValidations.callbacks.element.pass = function(element) {
      $('#result').text('Element Validate Pass ' + element.attr('id'));
    }
    $('form#new_user').validate();
  },
  afterEach: function() {
    ClientSideValidations.callbacks.element.pass = function(element, callback) { callback() }
  }
});

QUnit.test('runs callback when form element validate', function(assert) {
  var input = $('#user_name');

  assert.equal($('#result').text(), '');

  input.val('')
  input.trigger('change');
  input.trigger('focusout');
  assert.equal($('#result').text(), '');

  input.val('test')
  input.trigger('change');
  input.trigger('focusout');
  assert.equal($('#result').text(), 'Element Validate Pass user_name');
});

QUnit.test('runs callback when form validates', function(assert) {
  var form = $('#new_user'), input = form.find('input');

  assert.equal($('#result').text(), '');

  input.val('')
  input.trigger('change');
  form.trigger('submit');

  assert.equal($('#result').text(), '');

  input.val('test')
  input.trigger('change');
  form.trigger('submit');

  assert.equal($('#result').text(), 'Element Validate Pass user_name');
});

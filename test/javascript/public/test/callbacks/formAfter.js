QUnit.module('Form Validate After Callback', {
  beforeEach: function () {
    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>'
      },
      validators: { 'user[name]': { presence: [{ message: 'must be present' }] } }
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
      .append($('<label for="user_name">Name</label>'))

    ClientSideValidations.callbacks.form.after = function (form, message) {
      $('#result').text('Form Validate After ' + form.attr('id'))
    }
    $('form#new_user').validate()
  },
  afterEach: function () {
    ClientSideValidations.callbacks.form.after = function (form, eventData) {}
  }
})

QUnit.test('runs callback', function (assert) {
  var form = $('#new_user')
  var input = form.find('input')

  assert.equal($('#result').text(), '')

  form.submit()
  assert.equal($('#result').text(), 'Form Validate After new_user')
})

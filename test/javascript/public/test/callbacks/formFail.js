QUnit.module('Form Validate Fail Callback', {
  beforeEach: function () {
    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: { 'user[name]': { presence: [{ message: 'must be present' }] } }
    }

    $('#qunit-fixture')
      .append($('<span id="result">'))
      .append($('<form>', {
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

    ClientSideValidations.callbacks.form.fail = function (form, message) {
      $('#result').text('Form Validate Fail ' + form.attr('id'))
    }
    $('form#new_user').validate()
  },
  afterEach: function () {
    ClientSideValidations.callbacks.form.fail = function (form, eventData) {}
  }
})

QUnit.test('runs callback', function (assert) {
  var form = $('#new_user')
  var input = form.find('input')

  assert.equal($('#result').text(), '')

  form.submit()
  assert.equal($('#result').text(), 'Form Validate Fail new_user')

  $('#result').text('')
  input.val('test')
  input.trigger('change')
  form.submit()
  assert.equal($('#result').text(), '')
})

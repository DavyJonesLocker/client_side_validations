QUnit.module('Element Validate After Callback', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var result = document.createElement('span')
    var form = document.createElement('form')
    var input = document.createElement('input')
    var label = document.createElement('label')
    var dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: { 'user[name]': { presence: [{ message: 'must be present' }] } }
    }

    result.id = 'result'
    form.action = '/users'
    form.dataset.clientSideValidations = JSON.stringify(dataCsv)
    form.method = 'post'
    form.id = 'new_user'
    input.name = 'user[name]'
    input.id = 'user_name'
    input.type = 'text'
    label.htmlFor = 'user_name'
    label.textContent = 'Name'

    form.appendChild(input)
    form.appendChild(label)
    fixture.appendChild(result)
    fixture.appendChild(form)

    ClientSideValidations.callbacks.element.after = function (element) {
      document.getElementById('result').textContent = 'Element Validate After ' + element.id
    }
    ClientSideValidations.validate(form)
  },

  afterEach: function () {
    ClientSideValidations.callbacks.element.after = function (element, eventData) {}
    document.getElementById('qunit-fixture').replaceChildren()
  }
})

QUnit.test('runs callback when form element validate', function (assert) {
  var input = document.getElementById('user_name')

  assert.equal(document.getElementById('result').textContent, '')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.equal(document.getElementById('result').textContent, 'Element Validate After user_name')
})

QUnit.test('runs callback when form validates', function (assert) {
  var form = document.getElementById('new_user')

  assert.equal(document.getElementById('result').textContent, '')

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  assert.equal(document.getElementById('result').textContent, 'Element Validate After user_name')
})

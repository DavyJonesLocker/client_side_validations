QUnit.module('Validate Form', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var form = document.createElement('form')
    var input = document.createElement('input')
    var label = document.createElement('label')

    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: { 'user[name]': { presence: [{ message: 'must be present' }] } }
    }

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
    fixture.appendChild(form)

    ClientSideValidations.validate(form)
  }
})

QUnit.test('Validate form with invalid form (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')

  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(input.parentElement.classList.contains('field_with_errors'))
    assert.ok(label.parentElement.classList.contains('field_with_errors'))
    assert.ok(input.parentElement.querySelector('label.message'))
    assert.notOk(response)
    done()
  }, 250)
})

QUnit.test('Validate form with valid form (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')

  input.value = 'Test'
  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(response)
    done()
  }, 250)
})

QUnit.test('Validate form with an input changed to false (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')

  input.value = 'Test'
  input.dataset.csvChanged = 'false'

  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(response)
    done()
  }, 250)
})

QUnit.test('Ensure ajax:beforeSend is not from a bubbled event (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var link = document.createElement('a')

  form.appendChild(link)
  link.dispatchEvent(new CustomEvent('ajax:beforeSend', { bubbles: true }))

  setTimeout(function () {
    assert.notOk(input.parentElement.classList.contains('field_with_errors'))
    done()
  }, 250)
})

QUnit.test('Validate form with invalid form and disabling validations (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')

  ClientSideValidations.disable(form)
  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(response)
    done()
  }, 250)
})

QUnit.test('Handle disable-with (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var submitButton = document.createElement('input')

  submitButton.type = 'submit'
  submitButton.dataset.disableWith = 'Waiting...'
  submitButton.name = 'commit'
  submitButton.value = 'Save'
  submitButton.id = 'submit_button'
  form.appendChild(submitButton)

  form.requestSubmit(submitButton)

  setTimeout(function () {
    assert.notOk(submitButton.disabled)
    done()
  }, 250)
})

QUnit.test('Disabled inputs do not stop form submission (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')

  ClientSideValidations.disable(input)
  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(response)
    done()
  }, 250)
})

QUnit.test('Inputs inside hidden containers do not stop form submission (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')
  var hiddenContainer = document.createElement('div')

  hiddenContainer.hidden = true
  form.insertBefore(hiddenContainer, input)
  hiddenContainer.appendChild(input)
  hiddenContainer.appendChild(label)

  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(response)
    assert.notOk(input.parentElement.classList.contains('field_with_errors'))
    done()
  }, 250)
})

QUnit.test('Decorative (without name) inputs aren\'t validated (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var decorativeInput = document.createElement('input')

  input.value = 'Test'
  decorativeInput.type = 'text'
  form.appendChild(decorativeInput)
  ClientSideValidations.validate(form)

  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.ok(response)
    done()
  }, 250)
})

QUnit.test('Resetting client side validations', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')

  form.requestSubmit()
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
  assert.ok(input.parentElement.querySelector('label.message'))

  ClientSideValidations.reset(form)
  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
  assert.notOk(label.parentElement.classList.contains('field_with_errors'))
  assert.notOk(input.parentElement.querySelector('label.message'))

  form.requestSubmit()
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
  assert.ok(input.parentElement.querySelector('label.message'))
})

QUnit.test('Disable client side validations on all child inputs', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')

  ClientSideValidations.disable(form)

  input.dispatchEvent(new Event('focusout', { bubbles: true }))

  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
  assert.notOk(label.parentElement.classList.contains('field_with_errors'))
  assert.notOk(input.parentElement.querySelector('label.message'))
})

QUnit.test('Disable ignores non-element nodes in mixed collections', function (assert) {
  var input = document.getElementById('user_name')
  var textNode = document.createTextNode('ignored node')

  assert.ok(input.dataset.csvValidate)

  ClientSideValidations.disable([document, textNode, input])

  assert.strictEqual(input.dataset.csvValidate, undefined)

  input.dispatchEvent(new Event('focusout', { bubbles: true }))

  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
})

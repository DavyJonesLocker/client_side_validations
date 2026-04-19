QUnit.module('Format options')

QUnit.test('when matching format', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation', 'with': /\d+/ }
  element.value = '123'
  assert.equal(ClientSideValidations.validators.local.format(element, options), undefined)
})

QUnit.test('when not matching format', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation', 'with': /\d+/ }
  element.value = 'abc'
  assert.equal(ClientSideValidations.validators.local.format(element, options), 'failed validation')
})

QUnit.test('when allowing blank', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation', 'with': /\d+/, allow_blank: true }
  assert.equal(ClientSideValidations.validators.local.format(element, options), undefined)
})

QUnit.test('when not allowing blank', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation', 'with': /\d+/ }
  assert.equal(ClientSideValidations.validators.local.format(element, options), 'failed validation')
})

QUnit.test('when using the without option and the Regex is matched', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation', without: /R/ }
  element.value = 'Rock'
  assert.equal(ClientSideValidations.validators.local.format(element, options), 'failed validation')
})

QUnit.test('when using the without option and the Regex is not matched', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation', without: /R/ }
  element.value = 'Lock'
  assert.equal(ClientSideValidations.validators.local.format(element, options), undefined)
})

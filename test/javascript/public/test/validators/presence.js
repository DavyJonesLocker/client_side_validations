QUnit.module('Presence options')

QUnit.test('when value is not empty', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation' }
  element.value = 'not empty'
  assert.equal(ClientSideValidations.validators.local.presence(element, options), undefined)
})

QUnit.test('when value is empty', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.presence(element, options), 'failed validation')
})

QUnit.test('when value is null from non-selected multi-select element', function (assert) {
  var element = document.createElement('select')
  element.multiple = true
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.presence(element, options), 'failed validation')
})

QUnit.module('Absence options')

QUnit.test('when value is not empty', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation' }
  element.value = 'not empty'
  assert.equal(ClientSideValidations.validators.local.absence(element, options), 'failed validation')
})

QUnit.test('when value is only spaces', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation' }
  element.value = '   '
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is empty', function (assert) {
  var element = document.createElement('input')
  element.type = 'text'
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is null from non-selected multi-select element', function (assert) {
  var element = document.createElement('select')
  element.multiple = true
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is not null from multi-select element', function (assert) {
  var element = document.createElement('select')
  var option = document.createElement('option')
  element.multiple = true
  var options = { message: 'failed validation' }
  option.value = 'selected-option'
  option.textContent = 'Option'
  element.appendChild(option)
  element.value = 'selected-option'
  assert.equal(ClientSideValidations.validators.local.absence(element, options), 'failed validation')
})

QUnit.test('when value is null from select element', function (assert) {
  var element = document.createElement('select')
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is not null from select element', function (assert) {
  var element = document.createElement('select')
  var option = document.createElement('option')
  var options = { message: 'failed validation' }
  option.value = 'selected-option'
  option.textContent = 'Option'
  element.appendChild(option)
  element.value = 'selected-option'
  assert.equal(ClientSideValidations.validators.local.absence(element, options), 'failed validation')
})

QUnit.module('Absence options')

QUnit.test('when value is not empty', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation' }
  element.val('not empty')
  assert.equal(ClientSideValidations.validators.local.absence(element, options), 'failed validation')
})

QUnit.test('when value is only spaces', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation' }
  element.val('   ')
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is empty', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is null from non-selected multi-select element', function (assert) {
  var element = $('<select multiple="multiple">')
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is not null from multi-select element', function (assert) {
  var element = $('<select multiple="multiple">')
  var options = { message: 'failed validation' }
  element.append('<option value="selected-option">Option</option>')
  element.val('selected-option')
  assert.equal(ClientSideValidations.validators.local.absence(element, options), 'failed validation')
})

QUnit.test('when value is null from select element', function (assert) {
  var element = $('<select>')
  var options = { message: 'failed validation' }
  assert.equal(ClientSideValidations.validators.local.absence(element, options), undefined)
})

QUnit.test('when value is not null from select element', function (assert) {
  var element = $('<select>')
  var options = { message: 'failed validation' }
  element.append('<option value="selected-option">Option</option>')
  element.val('selected-option')
  assert.equal(ClientSideValidations.validators.local.absence(element, options), 'failed validation')
})

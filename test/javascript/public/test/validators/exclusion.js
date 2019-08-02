QUnit.module('Exclusion options')

QUnit.test('when value is not in the list', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation', 'in': [1, 2, 3] }
  element.val('4')
  assert.equal(ClientSideValidations.validators.local.exclusion(element, options), undefined)
})

QUnit.test('when value is not in the range', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation', range: [1, 3] }
  element.val('4')
  assert.equal(ClientSideValidations.validators.local.exclusion(element, options), undefined)
})

QUnit.test('when value is in the list', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation', 'in': [1, 2, 3] }
  element.val('1')
  assert.equal(ClientSideValidations.validators.local.exclusion(element, options), 'failed validation')
})

QUnit.test('when value is in the range', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation', range: [1, 3] }
  element.val('1')
  assert.equal(ClientSideValidations.validators.local.exclusion(element, options), 'failed validation')
})

QUnit.test('when allowing blank', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation', 'in': [1, 2, 3], allow_blank: true }
  assert.equal(ClientSideValidations.validators.local.exclusion(element, options), undefined)
})

QUnit.test('when not allowing blank', function (assert) {
  var element = $('<input type="text" />')
  var options = { message: 'failed validation', 'in': [1, 2, 3] }
  assert.equal(ClientSideValidations.validators.local.exclusion(element, options), 'failed validation')
})

QUnit.module('Numericality options', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var form = document.createElement('form')
    var input = document.createElement('input')

    form.id = 'form'
    form.ClientSideValidations = {
      settings: {
        number_format: { separator: '.', delimiter: ',' }
      }
    }

    input.id = 'number_value'
    input.type = 'text'

    form.appendChild(input)
    fixture.appendChild(form)
  },

  afterEach: function () {
    var form = document.getElementById('form')

    if (form) {
      form.remove()
    }
  }
})

QUnit.test('when value is a number', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { numericality: 'failed validation' } }
  element.value = '123'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when value is a decimal number', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { numericality: 'failed validation' } }
  element.value = '123.456'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when there is a custom number format', function (assert) {
  var element = document.getElementById('number_value')
  document.getElementById('form').ClientSideValidations.settings.number_format = { separator: ',', delimiter: '.' }
  var options = { messages: { numericality: 'failed validation' } }
  element.value = '123,45'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when value is not a number', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { numericality: 'failed validation' } }
  element.value = 'abc123'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when no value', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { numericality: 'failed validation' } }
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when no value and allowing blank', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { numericality: 'failed validation' }, allow_blank: true }
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when bad value and allowing blank', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { numericality: 'failed validation' }, allow_blank: true }
  element.value = 'abc123'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing integers and allowing blank', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { only_integer: 'failed validation', numericality: 'failed validation' }, only_integer: true, allow_blank: true }
  element.value = ''
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing integers and value is integer', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { only_integer: 'failed validation', numericality: 'failed validation' }, only_integer: true }
  element.value = '123'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing integers and value is integer with whitespace', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { only_integer: 'failed validation', numericality: 'failed validation' }, only_integer: true }
  element.value = ' 123 '
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing integers and value has a negative or positive sign', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { only_integer: 'failed validation', numericality: 'failed validation' }, only_integer: true }
  element.value = '-23'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
  element.value = '+23'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing integers and value is not integer', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { only_integer: 'failed validation', numericality: 'failed validation' }, only_integer: true }
  element.value = '123.456'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing integers and value has a delimiter', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { only_integer: 'failed validation', numericality: 'failed validation' }, only_integer: true }
  element.value = '10,000'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing values greater than 10 and value is greater than 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { greater_than: 'failed validation', numericality: 'failed validation' }, greater_than: 10 }
  element.value = '11'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing values greater than 10 and value is 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { greater_than: 'failed validation', numericality: 'failed validation' }, greater_than: 10 }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing values greater than or equal to 10 and value is 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { greater_than_or_equal_to: 'failed validation', numericality: 'failed validation' }, greater_than_or_equal_to: 10 }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing values greater than or equal to 10 and value is 9', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { greater_than_or_equal_to: 'failed validation', numericality: 'failed validation' }, greater_than_or_equal_to: 10 }
  element.value = '9'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing values less than 10 and value is less than 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { less_than: 'failed validation', numericality: 'failed validation' }, less_than: 10 }
  element.value = '9'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing values less than 10 and value is 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { less_than: 'failed validation', numericality: 'failed validation' }, less_than: 10 }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing values less than or equal to 10 and value is 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { less_than_or_equal_to: 'failed validation', numericality: 'failed validation' }, less_than_or_equal_to: 10 }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing values less than or equal to 10 and value is 11', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { less_than_or_equal_to: 'failed validation', numericality: 'failed validation' }, less_than_or_equal_to: 10 }
  element.value = '11'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing values equal to 10 and value is 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { equal_to: 'failed validation', numericality: 'failed validation' }, equal_to: 10 }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing values equal to 10 and value is 11', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { equal_to: 'failed validation', numericality: 'failed validation' }, equal_to: 10 }
  element.value = '11'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing value equal to 0 and value is 1', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { equal_to: 'failed validation', numericality: 'failed validation' }, equal_to: 0 }
  element.value = '1'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing odd values and the value is odd', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true }
  element.value = '11'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing odd values and the value is even', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { odd: 'failed validation', numericality: 'failed validation' }, odd: true }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing even values and the value is even', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing even values and the value is odd', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { even: 'failed validation', numericality: 'failed validation' }, even: true }
  element.value = '11'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when only allowing values other than 10 and value is 11', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { other_than: 'failed validation', numericality: 'failed validation' }, other_than: 10 }
  element.value = '11'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined)
})

QUnit.test('when only allowing values other than 10 and value is 10', function (assert) {
  var element = document.getElementById('number_value')
  var options = { messages: { other_than: 'failed validation', numericality: 'failed validation' }, other_than: 10 }
  element.value = '10'
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), 'failed validation')
})

QUnit.test('when value refers to another present input', function (assert) {
  var form = document.getElementById('form')
  var element1 = document.createElement('input')
  var element2 = document.createElement('input')
  var options = { messages: { greater_than: 'failed to be greater', numericality: 'failed validation' }, greater_than: 'points_2' }

  element1.type = 'text'
  element1.name = 'points_1'
  form.appendChild(element1)

  element2.type = 'text'
  element2.name = 'points_2'
  form.appendChild(element2)

  element1.value = 0
  element2.value = 1
  assert.equal(ClientSideValidations.validators.local.numericality(element1, options), 'failed to be greater')
  element1.value = 2
  assert.equal(ClientSideValidations.validators.local.numericality(element1, options), undefined)
})

QUnit.test('when value refers to another present empty input', function (assert) {
  var form = document.getElementById('form')
  var element1 = document.createElement('input')
  var element2 = document.createElement('input')
  var options = { messages: { greater_than: 'failed to be greater', numericality: 'failed validation' }, greater_than: 'points_2' }

  element1.type = 'text'
  element1.name = 'points_1'
  form.appendChild(element1)

  element2.type = 'text'
  element2.name = 'points_2'
  form.appendChild(element2)

  element1.value = 0
  assert.equal(ClientSideValidations.validators.local.numericality(element1, options), undefined)
})

QUnit.test('when value refers to another present input but with more than one match', function (assert) {
  var form = document.getElementById('form')
  var element1 = document.createElement('input')
  var element2 = document.createElement('input')
  var element3 = document.createElement('input')
  var options = { messages: { greater_than: 'failed to be greater', numericality: 'failed validation' }, greater_than: 'points_2' }

  element1.type = 'text'
  element1.name = 'points_1'
  form.appendChild(element1)

  element2.type = 'text'
  element2.name = 'points_2'
  form.appendChild(element2)

  element3.type = 'text'
  element3.name = 'points_21'
  form.appendChild(element3)

  element1.value = 1
  element2.value = 2
  element3.value = 0
  assert.equal(ClientSideValidations.validators.local.numericality(element1, options), undefined)
})

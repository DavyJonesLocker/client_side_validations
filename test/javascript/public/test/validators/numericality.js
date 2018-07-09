QUnit.module('Numericality options', {
  beforeEach: function() {
    dataCsv = {
      number_format: { separator: '.', delimiter: ',' },
    }

    $('#qunit-fixture')
      .append($('<form />', {
        action: '/users',
        id: 'form',
        method: 'post',
        'data-client-side-validations': JSON.stringify(dataCsv),
      }))
      .find('form')
        .append($('<input />', {
          type: 'text'
        }))

    $('#qunit-fixture form').validate();
  },

  afterEach: function() {
    $('#qunit-fixture').remove('form');
  }
});

QUnit.test('when value is a number', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" } };
  element.val('123');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when value is a decimal number', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" } };
  element.val('123.456');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when value is a decimal number with delimiters', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" } };
  element.val('123,456,789.10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when there is a custom number format', function(assert) {
  var element = $('#form input');
  $('#qunit-fixture form')[0].ClientSideValidations.settings.number_format = { separator: ',', delimiter: '.' };
  var options = { messages: { numericality: "failed validation" } };
  element.val('123,45');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when there is a custom number format with delimiters', function(assert) {
  var element = $('#form input');
  $('#qunit-fixture form')[0].ClientSideValidations.settings.number_format = { separator: ',', delimiter: '.' };
  var options = { messages: { numericality: "failed validation" } };
  element.val('123.456,78');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when value is not a number', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" } };
  element.val('abc123');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when no value', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" } };
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when no value and allowing blank', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" }, allow_blank: true };
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when bad value and allowing blank', function(assert) {
  var element = $('#form input');
  var options = { messages: { numericality: "failed validation" }, allow_blank: true };
  element.val('abc123');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing integers and allowing blank', function(assert) {
  var element = $('#form input');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true, allow_blank: true };
  element.val('');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing integers and value is integer', function(assert) {
  var element = $('#form input');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('123');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing integers and value is integer with whitespace', function(assert) {
  var element = $('#form input');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val(' 123 ');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing integers and value has a negative or positive sign', function(assert) {
  var element = $('#form input');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('-23');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
  element.val('+23');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing integers and value is not integer', function(assert) {
  var element = $('#form input');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('123.456');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing integers and value has a delimiter', function(assert) {
  var element = $('#form input');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('10,000');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing values greater than 10 and value is greater than 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { greater_than: "failed validation", numericality: "failed validation" }, greater_than: 10 };
  element.val('11');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing values greater than 10 and value is 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { greater_than: "failed validation", numericality: "failed validation" }, greater_than: 10 };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing values greater than or equal to 10 and value is 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { greater_than_or_equal_to: "failed validation", numericality: "failed validation" }, greater_than_or_equal_to: 10 };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing values greater than or equal to 10 and value is 9', function(assert) {
  var element = $('#form input');
  var options = { messages: { greater_than_or_equal_to: "failed validation", numericality: "failed validation" }, greater_than_or_equal_to: 10 };
  element.val('9');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing values less than 10 and value is less than 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { less_than: "failed validation", numericality: "failed validation" }, less_than: 10 };
  element.val('9');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing values less than 10 and value is 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { less_than: "failed validation", numericality: "failed validation" }, less_than: 10 };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing values less than or equal to 10 and value is 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { less_than_or_equal_to: "failed validation", numericality: "failed validation" }, less_than_or_equal_to: 10 };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing values less than or equal to 10 and value is 11', function(assert) {
  var element = $('#form input');
  var options = { messages: { less_than_or_equal_to: "failed validation", numericality: "failed validation" }, less_than_or_equal_to: 10 };
  element.val('11');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing values equal to 10 and value is 10', function(assert) {
  var element = $('#form input');
  var options = { messages: { equal_to: "failed validation", numericality: "failed validation" }, equal_to: 10 };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing values equal to 10 and value is 11', function(assert) {
  var element = $('#form input');
  var options = { messages: { equal_to: "failed validation", numericality: "failed validation" }, equal_to: 10 };
  element.val('11');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing value equal to 0 and value is 1', function(assert) {
  var element = $('#form input');
  var options = { messages: { equal_to: "failed validation", numericality: "failed validation" }, equal_to: 0 };
  element.val('1');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing odd values and the value is odd', function(assert) {
  var element = $('#form input');
  var options = { messages: { odd: "failed validation", numericality: "failed validation" }, odd: true };
  element.val('11');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing odd values and the value is even', function(assert) {
  var element = $('#form input');
  var options = { messages: { odd: "failed validation", numericality: "failed validation" }, odd: true };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when only allowing even values and the value is even', function(assert) {
  var element = $('#form input');
  var options = { messages: { even: "failed validation", numericality: "failed validation" }, even: true };
  element.val('10');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

QUnit.test('when only allowing even values and the value is odd', function(assert) {
  var element = $('#form input');
  var options = { messages: { even: "failed validation", numericality: "failed validation" }, even: true };
  element.val('11');
  assert.equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

QUnit.test('when value refers to another present input', function(assert) {
  var form = $('#form')
  var element_1 = $('<input type="text" name="points_1" />');
  var element_2 = $('<input type="text" name="points_2" />');
  var options   = { messages: { greater_than: "failed to be greater", numericality: "failed validation" }, greater_than: 'points_2' };

  form.append(element_1).append(element_2);
  $('#qunit-fixture')
    .append(form);

  element_1.val(0)
  element_2.val(1)
  assert.equal(ClientSideValidations.validators.local.numericality(element_1, options), "failed to be greater");
  element_1.val(2)
  assert.equal(ClientSideValidations.validators.local.numericality(element_1, options), undefined);
});

QUnit.test('when value refers to another present empty input', function(assert) {
  var form = $('#form')
  var element_1 = $('<input type="text" name="points_1" />');
  var element_2 = $('<input type="text" name="points_2" />');
  var options   = { messages: { greater_than: "failed to be greater", numericality: "failed validation" }, greater_than: 'points_2' };

  form.append(element_1).append(element_2);
  $('#qunit-fixture')
    .append(form);

  element_1.val(0)
  assert.equal(ClientSideValidations.validators.local.numericality(element_1, options), undefined);
});

QUnit.test('when value refers to another present input but with more than one match', function(assert) {
  var form = $('#form')
  var element_1 = $('<input type="text" name="points_1" />');
  var element_2 = $('<input type="text" name="points_2" />');
  var element_3 = $('<input type="text" name="points_21" />');
  var options   = { messages: { greater_than: "failed to be greater", numericality: "failed validation" }, greater_than: 'points_2' };

  form.append(element_1).append(element_2).append(element_3);
  $('#qunit-fixture')
    .append(form);

  element_1.val(1)
  element_2.val(2)
  element_3.val(0)
  assert.equal(ClientSideValidations.validators.local.numericality(element_1, options), undefined);
});

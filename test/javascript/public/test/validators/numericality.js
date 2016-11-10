module('Numericality options', {
  setup: function() {
    ClientSideValidations.number_format = { separator: '.', delimiter: ',' };
  }
});

test('when value is a number', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" } };
  element.val('123');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when value is a decimal number', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" } };
  element.val('123.456');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when there is a custom numericality pattern', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" } };
  var oldPattern = ClientSideValidations.patterns.numericality;
  element.val('123,45');
  ClientSideValidations.patterns.numericality = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d*)?$/;
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
  ClientSideValidations.patterns.numericality = oldPattern;
});

test('when value is not a number', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" } };
  element.val('abc123');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when no value', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" } };
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when no value and allowing blank', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" }, allow_blank: true };
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when bad value and allowing blank', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" }, allow_blank: true };
  element.val('abc123');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing integers and value is integer', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('123');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing integers and value is integer with whitespace', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val(' 123 ');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing integers and value has a negative or positive sign', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('-23');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
  element.val('+23');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing integers and value is not integer', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation", numericality: "failed validation" }, only_integer: true };
  element.val('123.456');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than: "failed validation", numericality: "failed validation" }, greater_than: 10 };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values greater than 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than: "failed validation", numericality: "failed validation" }, greater_than: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values greater than or equal to 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than_or_equal_to: "failed validation", numericality: "failed validation" }, greater_than_or_equal_to: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values greater than or equal to 10 and value is 9', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than_or_equal_to: "failed validation", numericality: "failed validation" }, greater_than_or_equal_to: 10 };
  element.val('9');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values less than 10 and value is less than 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than: "failed validation", numericality: "failed validation" }, less_than: 10 };
  element.val('9');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values less than 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than: "failed validation", numericality: "failed validation" }, less_than: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values less than or equal to 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than_or_equal_to: "failed validation", numericality: "failed validation" }, less_than_or_equal_to: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values less than or equal to 10 and value is 11', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than_or_equal_to: "failed validation", numericality: "failed validation" }, less_than_or_equal_to: 10 };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values equal to 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { equal_to: "failed validation", numericality: "failed validation" }, equal_to: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values equal to 10 and value is 11', function() {
  var element = $('<input type="text" />');
  var options = { messages: { equal_to: "failed validation", numericality: "failed validation" }, equal_to: 10 };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing value equal to 0 and value is 1', function() {
  var element = $('<input type="text" />');
  var options = { messages: { equal_to: "failed validation", numericality: "failed validation" }, equal_to: 0 };
  element.val('1');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing odd values and the value is odd', function() {
  var element = $('<input type="text" />');
  var options = { messages: { odd: "failed validation", numericality: "failed validation" }, odd: true };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing odd values and the value is even', function() {
  var element = $('<input type="text" />');
  var options = { messages: { odd: "failed validation", numericality: "failed validation" }, odd: true };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing even values and the value is even', function() {
  var element = $('<input type="text" />');
  var options = { messages: { even: "failed validation", numericality: "failed validation" }, even: true };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing even values and the value is odd', function() {
  var element = $('<input type="text" />');
  var options = { messages: { even: "failed validation", numericality: "failed validation" }, even: true };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when value refers to another present input', function() {
  var form = $('<form />')
  var element_1 = $('<input type="text" name="points_1" />');
  var element_2 = $('<input type="text" name="points_2" />');
  var options   = { messages: { greater_than: "failed to be greater", numericality: "failed validation" }, greater_than: 'points_2' };

  form.append(element_1).append(element_2);
  $('#qunit-fixture')
    .append(form);

  element_1.val(0)
  element_2.val(1)
  equal(ClientSideValidations.validators.local.numericality(element_1, options), "failed to be greater");
  element_1.val(2)
  equal(ClientSideValidations.validators.local.numericality(element_1, options), undefined);
});

test('when value refers to another present empty input', function() {
  var form = $('<form />')
  var element_1 = $('<input type="text" name="points_1" />');
  var element_2 = $('<input type="text" name="points_2" />');
  var options   = { messages: { greater_than: "failed to be greater", numericality: "failed validation" }, greater_than: 'points_2' };

  form.append(element_1).append(element_2);
  $('#qunit-fixture')
    .append(form);

  element_1.val(0)
  equal(ClientSideValidations.validators.local.numericality(element_1, options), undefined);
});

test('when value refers to another present input but with more than one match', function() {
  var form = $('<form />')
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
  equal(ClientSideValidations.validators.local.numericality(element_1, options), undefined);
});

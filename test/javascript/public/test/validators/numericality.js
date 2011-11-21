module('Numericality options');

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

test('when value is not a number', function() {
  var element = $('<input type="text" />');
  var options = { messages: { numericality: "failed validation" } };
  element.val('abc123');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing integers and value is integer', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation" }, only_integer: true };
  element.val('123');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing integers and value has a negative or positive sign', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation"}, only_integer: true };
  element.val('-23');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
  element.val('+23');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing integers and value is not integer', function() {
  var element = $('<input type="text" />');
  var options = { messages: { only_integer: "failed validation" }, only_integer: true };
  element.val('123.456');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than: "failed validation" }, greater_than: 10 };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values greater than 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than: "failed validation" }, greater_than: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values greater than or equal to 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than_or_equal_to: "failed validation" }, greater_than_or_equal_to: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values greater than or equal to 10 and value is 9', function() {
  var element = $('<input type="text" />');
  var options = { messages: { greater_than_or_equal_to: "failed validation" }, greater_than_or_equal_to: 10 };
  element.val('9');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values less than 10 and value is less than 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than: "failed validation" }, less_than: 10 };
  element.val('9');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values less than 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than: "failed validation" }, less_than: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values less than or equal to 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than_or_equal_to: "failed validation" }, less_than_or_equal_to: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values less than or equal to 10 and value is 11', function() {
  var element = $('<input type="text" />');
  var options = { messages: { less_than_or_equal_to: "failed validation" }, less_than_or_equal_to: 10 };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing values equal to 10 and value is 10', function() {
  var element = $('<input type="text" />');
  var options = { messages: { equal_to: "failed validation" }, equal_to: 10 };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing values equal to 10 and value is 11', function() {
  var element = $('<input type="text" />');
  var options = { messages: { equal_to: "failed validation" }, equal_to: 10 };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing value equal to 0 and value is 1', function() {
  var element = $('<input type="text" />');
  var options = { messages: { equal_to: "failed validation" }, equal_to: 0 };
  element.val('1');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing odd values and the value is odd', function() {
  var element = $('<input type="text" />');
  var options = { messages: { odd: "failed validation" }, odd: true };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing odd values and the value is even', function() {
  var element = $('<input type="text" />');
  var options = { messages: { odd: "failed validation" }, odd: true };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});

test('when only allowing even values and the value is even', function() {
  var element = $('<input type="text" />');
  var options = { messages: { even: "failed validation" }, even: true };
  element.val('10');
  equal(ClientSideValidations.validators.local.numericality(element, options), undefined);
});

test('when only allowing even values and the value is odd', function() {
  var element = $('<input type="text" />');
  var options = { messages: { even: "failed validation" }, even: true };
  element.val('11');
  equal(ClientSideValidations.validators.local.numericality(element, options), "failed validation");
});


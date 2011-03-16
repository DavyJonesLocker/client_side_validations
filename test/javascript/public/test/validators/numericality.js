module('Numericality Validator');

test('when value is a number', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation" };
  selector.val('123');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when value is a decimal number', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation" };
  selector.val('123.456');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when value is not a number', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { numericality: "failed validation" } };
  selector.val('abc123');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing integers and value is integer', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { only_integer: "failed validation" }, only_integer: true };
  selector.val('123');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing integers and value is not integer', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { only_integer: "failed validation" }, only_integer: true };
  selector.val('123.456');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { greater_than: "failed validation" }, greater_than: 10 };
  selector.val('11');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing values greater than 10 and value is 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { greater_than: "failed validation" }, greater_than: 10 };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing values greater than or equal to 10 and value is 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { greater_than_or_equal_to: "failed validation" }, greater_than_or_equal_to: 10 };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing values greater than or equal to 10 and value is 9', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { greater_than_or_equal_to: "failed validation" }, greater_than_or_equal_to: 10 };
  selector.val('9');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing values less than 10 and value is less than 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { less_than: "failed validation" }, less_than: 10 };
  selector.val('9');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing values less than 10 and value is 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { less_than: "failed validation" }, less_than: 10 };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing values less than or equal to 10 and value is 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { less_than_or_equal_to: "failed validation" }, less_than_or_equal_to: 10 };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing values less than or equal to 10 and value is 11', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { less_than_or_equal_to: "failed validation" }, less_than_or_equal_to: 10 };
  selector.val('11');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing values equal to 10 and value is 10', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { equal_to: "failed validation" }, equal_to: 10 };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing values equal to 10 and value is 11', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { equal_to: "failed validation" }, equal_to: 10 };
  selector.val('11');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing odd values and the value is odd', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { odd: "failed validation" }, odd: true };
  selector.val('11');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing odd values and the value is even', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { odd: "failed validation" }, odd: true };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});

test('when only allowing even values and the value is even', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { even: "failed validation" }, even: true };
  selector.val('10');
  equal(clientSideValidations.validator.numericality(validator, selector), undefined);
});

test('when only allowing even values and the value is odd', function() {
  var selector = $('<input type="text" />');
  var validator = { messages: { even: "failed validation" }, even: true };
  selector.val('11');
  equal(clientSideValidations.validator.numericality(validator, selector), "failed validation");
});


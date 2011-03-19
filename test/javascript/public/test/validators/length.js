module('Length Validator');

test('when allowed length is 3 and value length is 3', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  equal(clientSideValidations.validator.length(validator, element), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3 };
  element.val('1234');
  equal(clientSideValidations.validator.length(validator, element), "failed validation");
});

test('when allowed length is 3 and value length is 2', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3 };
  element.val('12');
  equal(clientSideValidations.validator.length(validator, element), "failed validation");
});

test('when allowing blank and allowed length is 3', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3, allow_blank: true };
  equal(clientSideValidations.validator.length(validator, element), undefined);
});

test('when allowing blank and allowed length is 3', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3 };
  equal(clientSideValidations.validator.length(validator, element), "failed validation");
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  var element = $('<input type="text" />');
  element.val("one two three");
  var validator = { messages: { is: "failed validation" }, is: 3, js_tokenizer: "match(/\\w+/g)" };
  equal(clientSideValidations.validator.length(validator, element), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  equal(clientSideValidations.validator.length(validator, element), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { minimum: "failed validation" }, minimum: 3 };
  element.val('12');
  equal(clientSideValidations.validator.length(validator, element), "failed validation");
});

test('when allowed length maximum is 3 and value length is 3', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  equal(clientSideValidations.validator.length(validator, element), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  var element = $('<input type="text" />');
  var validator = { messages: { maximum: "failed validation" }, maximum: 3 };
  element.val('1234');
  equal(clientSideValidations.validator.length(validator, element), "failed validation");
});


module('Length options');

test('when allowed length is 3 and value length is 3', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('1234');
  equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

test('when allowed length is 3 and value length is 2', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('12');
  equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

test('when allowing blank and allowed length is 3', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3, allow_blank: true };
  equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  var element = $('<input type="text" />');
  var options = { messages: { minimum: "failed minimum validation", maximum: "failed maximum validation" }, minimum: 3, maximum: 100, allow_blank: true };
  equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  var element = $('<input type="text" />');
  element.val("one two three");
  var options = { messages: { is: "failed validation" }, is: 3, js_tokenizer: "match(/\\w+/g)" };
  equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  var element = $('<input type="text" />');
  var options = { messages: { minimum: "failed validation" }, minimum: 3 };
  element.val('12');
  equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

test('when allowed length maximum is 3 and value length is 3', function() {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  var element = $('<input type="text" />');
  var options = { messages: { maximum: "failed validation" }, maximum: 3 };
  element.val('1234');
  equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});


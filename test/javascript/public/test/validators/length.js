QUnit.module('Length options');

QUnit.test('when allowed length is 3 and value length is 3', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  assert.equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

QUnit.test('when allowed length is 3 and value length is 4', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('1234');
  assert.equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

QUnit.test('when allowed length is 3 and value length is 2', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('12');
  assert.equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

QUnit.test('when allowing blank and allowed length is 3', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3, allow_blank: true };
  assert.equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

QUnit.test('when allowing blank and minimum length is 3 and maximum length is 100', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { minimum: "failed minimum validation", maximum: "failed maximum validation" }, minimum: 3, maximum: 100, allow_blank: true };
  assert.equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

QUnit.test('when not allowing blank and allowed length is 3', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  assert.equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

QUnit.test('when allowed length minimum is 3 and value length is 3', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  assert.equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

QUnit.test('when allowed length minimum is 3 and value length is 2', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { minimum: "failed validation" }, minimum: 3 };
  element.val('12');
  assert.equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

QUnit.test('when allowed length maximum is 3 and value length is 3', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { is: "failed validation" }, is: 3 };
  element.val('123');
  assert.equal(ClientSideValidations.validators.local.length(element, options), undefined);
});

QUnit.test('when allowed length maximum is 3 and value length is 4', function(assert) {
  var element = $('<input type="text" />');
  var options = { messages: { maximum: "failed validation" }, maximum: 3 };
  element.val('1234');
  assert.equal(ClientSideValidations.validators.local.length(element, options), "failed validation");
});

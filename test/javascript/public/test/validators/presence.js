QUnit.module('Presence options');

QUnit.test('when value is not empty', function(assert) {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  element.val('not empty');
  assert.equal(ClientSideValidations.validators.local.presence(element, options), undefined);
});

QUnit.test('when value is empty', function(assert) {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  assert.equal(ClientSideValidations.validators.local.presence(element, options), "failed validation");
});

QUnit.test('when value is null from non-selected multi-select element', function(assert) {
  var element = $('<select multiple="multiple />');
  var options = { message: "failed validation" };
  assert.equal(ClientSideValidations.validators.local.presence(element, options), "failed validation");
});

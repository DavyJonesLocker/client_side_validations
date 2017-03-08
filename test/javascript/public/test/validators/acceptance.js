QUnit.module('Acceptance options');

QUnit.test('when checkbox and checked', function(assert) {
  var element = $('<input type="checkbox" />');
  var options = { message: "failed validation" };
  element.prop('checked', true)
  assert.equal(ClientSideValidations.validators.local.acceptance(element, options), undefined);
});

QUnit.test('when checkbox and not checked', function(assert) {
  var element = $('<input type="checkbox" />');
  var options = { message: "failed validation" };
  assert.equal(ClientSideValidations.validators.local.acceptance(element, options), "failed validation");
});

QUnit.test('when text and value default of 1', function(assert) {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  element.val("1");
  assert.equal(ClientSideValidations.validators.local.acceptance(element, options), undefined);
});

QUnit.test('when text and value 2 and accept value is 2', function(assert) {
  var element = $('<input type="text" />');
  var options = { message: "failed validation", accept: 1 };
  element.val("1");
  assert.equal(ClientSideValidations.validators.local.acceptance(element, options), undefined);
});

QUnit.test('when text and value empty', function(assert) {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  assert.equal(ClientSideValidations.validators.local.acceptance(element, options), "failed validation");
});

QUnit.test('when text and value 1 and accept value is 2', function(assert) {
  var element = $('<input type="text" />');
  var options = { message: "failed validation", accept: 2 };
  element.val("1");
  assert.equal(ClientSideValidations.validators.local.acceptance(element, options), "failed validation");
});

module('Absence options');

test('when value is not empty', function() {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  element.val('not empty');
  equal(ClientSideValidations.validators.local.absence(element, options), "failed validation");
});

test('when value is only spaces', function() {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  element.val('   ');
  equal(ClientSideValidations.validators.local.absence(element, options), undefined);
});

test('when value is empty', function() {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  equal(ClientSideValidations.validators.local.absence(element, options), undefined);
});

test('when value is null from non-selected multi-select element', function() {
  var element = $('<select multiple="multiple" />');
  var options = { message: "failed validation" };
  equal(ClientSideValidations.validators.local.absence(element, options), undefined);
});

test('when value is not null from multi-select element', function() {
  var element = $('<select multiple="multiple" />');
  var options = { message: "failed validation" };
  element.append('<option value="selected-option">Option</option>')
  element.val("selected-option")
  equal(ClientSideValidations.validators.local.absence(element, options), "failed validation");
});

test('when value is null from select element', function() {
  var element = $('<select />');
  var options = { message: "failed validation" };
  equal(ClientSideValidations.validators.local.absence(element, options), undefined);
});

test('when value is not null from select element', function() {
  var element = $('<select />');
  var options = { message: "failed validation" };
  element.append('<option value="selected-option">Option</option>')
  element.val("selected-option")
  equal(ClientSideValidations.validators.local.absence(element, options), "failed validation");
});

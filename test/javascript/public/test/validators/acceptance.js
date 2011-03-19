module('Acceptance Validator');

test('when checkbox and checked', function() {
  var element = $('<input type="checkbox" />');
  var validator = { message: "failed validation" };
  element.attr('checked', true)
  equal(clientSideValidations.validator.acceptance(validator, element), undefined);
});

test('when checkbox and not checked', function() {
  var element = $('<input type="checkbox" />');
  var validator = { message: "failed validation" };
  equal(clientSideValidations.validator.acceptance(validator, element), "failed validation");
});

test('when text and value default of 1', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation" };
  element.val("1");
  equal(clientSideValidations.validator.acceptance(validator, element), undefined);
});

test('when text and value 2 and accept value is 2', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", accept: 1 };
  element.val("1");
  equal(clientSideValidations.validator.acceptance(validator, element), undefined);
});

test('when text and value empty', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation" };
  equal(clientSideValidations.validator.acceptance(validator, element), "failed validation");
});

test('when text and value 1 and accept value is 2', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", accept: 2 };
  element.val("1");
  equal(clientSideValidations.validator.acceptance(validator, element), "failed validation");
});


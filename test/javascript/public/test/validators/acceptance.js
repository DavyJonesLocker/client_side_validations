module('Acceptance Validator');

test('when checkbox and checked', function() {
  var selector = $('<input type="checkbox" />');
  var validator = { message: "failed validation" };
  selector.attr('checked', true)
  equal(clientSideValidations.validator.acceptance(validator, selector), undefined);
});

test('when checkbox and not checked', function() {
  var selector = $('<input type="checkbox" />');
  var validator = { message: "failed validation" };
  equal(clientSideValidations.validator.acceptance(validator, selector), "failed validation");
});

test('when text and value default of 1', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation" };
  selector.val("1");
  equal(clientSideValidations.validator.acceptance(validator, selector), undefined);
});

test('when text and value 2 and accept value is 2', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", accept: 1 };
  selector.val("1");
  equal(clientSideValidations.validator.acceptance(validator, selector), undefined);
});

test('when text and value empty', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation" };
  equal(clientSideValidations.validator.acceptance(validator, selector), "failed validation");
});

test('when text and value 1 and accept value is 2', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", accept: 2 };
  selector.val("1");
  equal(clientSideValidations.validator.acceptance(validator, selector), "failed validation");
});


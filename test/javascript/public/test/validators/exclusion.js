module('Exclusion Validator');

test('when value is not in the list', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3] };
  element.val('4');
  equal(clientSideValidations.validators.exclusion(validator, element), undefined);
});

test('when value is in the list', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3] };
  element.val('1');
  equal(clientSideValidations.validators.exclusion(validator, element), "failed validation");
});

test('when allowing blank', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3], allow_blank: true };
  equal(clientSideValidations.validators.exclusion(validator, element), undefined);
});

test('when not allowing blank', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3] };
  equal(clientSideValidations.validators.exclusion(validator, element), "failed validation");
});

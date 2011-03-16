module('Inclusion Validator');

test('when value is in the list', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3] };
  selector.val('1');
  equal(clientSideValidations.validator.inclusion(validator, selector), undefined);
});

test('when value is not in the list', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3] };
  selector.val('4');
  equal(clientSideValidations.validator.inclusion(validator, selector), "failed validation");
});

test('when allowing blank', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3], allow_blank: true };
  equal(clientSideValidations.validator.inclusion(validator, selector), undefined);
});

test('when not allowing blank', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", in: [1, 2, 3] };
  equal(clientSideValidations.validator.inclusion(validator, selector), "failed validation");
});

module('Presence Validator');

test('when value is not empty', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation" };
  selector.val('not empty');
  equal(clientSideValidations.validator.presence(validator, selector), undefined);
});

test('when value is empty', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation" };
  equal(clientSideValidations.validator.presence(validator, selector), "failed validation");
});


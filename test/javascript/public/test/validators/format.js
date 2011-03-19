module('Format Validator');

test('when matching format', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  element.val('123');
  equal(clientSideValidations.validator.format(validator, element), undefined);
});

test('when not matching format', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  element.val('abc');
  equal(clientSideValidations.validator.format(validator, element), "failed validation");
});

test('when allowing blank', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/, allow_blank: true };
  equal(clientSideValidations.validator.format(validator, element), undefined);
});

test('when not allowing blank', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  equal(clientSideValidations.validator.format(validator, element), "failed validation");
});

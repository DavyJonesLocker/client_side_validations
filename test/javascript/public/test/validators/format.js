module('Format Validator');

test('when matching format', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  selector.val('123');
  equal(clientSideValidations.validator.format(validator, selector), undefined);
});

test('when not matching format', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  selector.val('abc');
  equal(clientSideValidations.validator.format(validator, selector), "failed validation");
});

test('when allowing blank', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/, allow_blank: true };
  equal(clientSideValidations.validator.format(validator, selector), undefined);
});

test('when not allowing blank', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  equal(clientSideValidations.validator.format(validator, selector), "failed validation");
});

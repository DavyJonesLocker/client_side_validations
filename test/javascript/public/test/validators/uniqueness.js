module('Uniqueness Validator');

test('when matching uniqueness on a non-nested resource', function() {
  var selector = $('<input type="text" name="user[email]"/>');
  var validator = { message: "failed validation" };
  selector.val('nottaken@test.com');
  equal(clientSideValidations.validator.uniqueness(validator, selector), undefined);
});

test('when matching uniqueness on a non-nested resource', function() {
  var selector = $('<input type="text" name="user[email]"/>');
  var validator = { message: "failed validation" };
  selector.val('taken@test.com');
  equal(clientSideValidations.validator.uniqueness(validator, selector), "failed validation");
});

test('when matching uniqueness on a nested singular resource', function() {
  var selector = $('<input type="text" name="profile[user_attributes][email]"/>');
  var validator = { message: "failed validation" };
  selector.val('nottaken@test.com');
  equal(clientSideValidations.validator.uniqueness(validator, selector), undefined);
});

test('when matching uniqueness on a nested singular resource', function() {
  var selector = $('<input type="text" name="profile[user_attributes][email]"/>');
  var validator = { message: "failed validation" };
  selector.val('taken@test.com');
  equal(clientSideValidations.validator.uniqueness(validator, selector), "failed validation");
});

test('when allowing blank', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/, allow_blank: true };
  equal(clientSideValidations.validator.uniqueness(validator, selector), undefined);
});

test('when not allowing blank', function() {
  var selector = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  equal(clientSideValidations.validator.uniqueness(validator, selector), "failed validation");
});


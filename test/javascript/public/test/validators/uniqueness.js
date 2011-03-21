module('Uniqueness Validator');

test('when matching uniqueness on a non-nested resource', function() {
  var element = $('<input type="text" name="user[email]"/>');
  var validator = { message: "failed validation" };
  element.val('nottaken@test.com');
  equal(clientSideValidations.validators.uniqueness(validator, element), undefined);
});

test('when matching uniqueness on a non-nested resource', function() {
  var element = $('<input type="text" name="user[email]"/>');
  var validator = { message: "failed validation" };
  element.val('taken@test.com');
  equal(clientSideValidations.validators.uniqueness(validator, element), "failed validation");
});

test('when matching uniqueness on a nested singular resource', function() {
  var element = $('<input type="text" name="profile[user_attributes][email]"/>');
  var validator = { message: "failed validation" };
  element.val('nottaken@test.com');
  equal(clientSideValidations.validators.uniqueness(validator, element), undefined);
});

test('when matching uniqueness on a nested singular resource', function() {
  var element = $('<input type="text" name="profile[user_attributes][email]"/>');
  var validator = { message: "failed validation" };
  element.val('taken@test.com');
  equal(clientSideValidations.validators.uniqueness(validator, element), "failed validation");
});

test('when allowing blank', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/, allow_blank: true };
  equal(clientSideValidations.validators.uniqueness(validator, element), undefined);
});

test('when not allowing blank', function() {
  var element = $('<input type="text" />');
  var validator = { message: "failed validation", with: /\d+/ };
  equal(clientSideValidations.validators.uniqueness(validator, element), "failed validation");
});

test('when using scopes with no replacement', function() {
  var element = $('<input type="text" name="user[age]" />');
  var validator = { message: "failed validation", with: /\d+/, scope: { name: 'test name' } };
  element.val('test');
  equal(clientSideValidations.validators.uniqueness(validator, element), "failed validation");
});

test('when using scopes with replacement', function() {
  var element = $('<input type="text" name="user[age]" />');
  var validator = { message: "failed validation", with: /\d+/, scope: { name: 'test name' } };
  element.val('test')
  $('#qunit-fixture').append('<input type="text" name="user[name]" />').find('input[name="user[name]"]').val('other name');
  equal(clientSideValidations.validators.uniqueness(validator, element), undefined);
});


module('Confirmation Validator', {
  setup: function() {
    $('#qunit-fixture')
      .append('<input id="password" type="password" />')
      .append('<input id="password_confirmation" type="password" />')
  }
});

test('when values match', function() {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var validator = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('test');
  equal(clientSideValidations.validator.confirmation(validator, password_element), undefined);
});

test('when values match', function() {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var validator = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('bad test');
  equal(clientSideValidations.validator.confirmation(validator, password_element), "failed validation");
});

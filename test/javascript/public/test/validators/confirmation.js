module('Confirmation Validator', {
  setup: function() {
    $('#qunit-fixture')
      .append('<input id="password" type="password" />')
      .append('<input id="password_confirmation" type="password" />')
  }
});

test('when values match', function() {
  var password_selector = $('#password');
  var password_confirmation_selector = $('#password_confirmation');
  var validator = { message: "failed validation" };
  password_selector.val('test');
  password_confirmation_selector.val('test');
  equal(clientSideValidations.validator.confirmation(validator, password_selector), undefined);
});

test('when values match', function() {
  var password_selector = $('#password');
  var password_confirmation_selector = $('#password_confirmation');
  var validator = { message: "failed validation" };
  password_selector.val('test');
  password_confirmation_selector.val('bad test');
  equal(clientSideValidations.validator.confirmation(validator, password_selector), "failed validation");
});

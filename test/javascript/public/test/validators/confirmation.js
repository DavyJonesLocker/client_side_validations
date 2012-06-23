module('Confirmation options', {
  setup: function() {
    $('#qunit-fixture')
      .append('<input id="password" type="password" />')
      .append('<input id="password_confirmation" type="password" data-confirm-on-confirmation="true" />')
  }
});

test('when values match', function() {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var options = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('test');
  equal(ClientSideValidations.validators.local.confirmation(password_element, options), undefined);
});

test('when values do not match', function() {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var options = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('bad test');
  equal(ClientSideValidations.validators.local.confirmation(password_element, options), "failed validation");
});

test('when the confirmation field is blank', function() {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var options = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('');
  equal(ClientSideValidations.validators.local.confirmation(password_element, options), undefined);
});

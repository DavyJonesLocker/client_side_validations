QUnit.module('Confirmation options', {
  beforeEach: function() {
    $('#qunit-fixture')
      .append('<input id="password" type="password" />')
      .append('<input id="password_confirmation" type="password" />')
  }
});

QUnit.test('when values match', function(assert) {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var options = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('test');
  assert.equal(ClientSideValidations.validators.local.confirmation(password_element, options), undefined);
});

QUnit.test('when values do not match', function(assert) {
  var password_element = $('#password');
  var password_confirmation_element = $('#password_confirmation');
  var options = { message: "failed validation" };
  password_element.val('test');
  password_confirmation_element.val('bad test');
  assert.equal(ClientSideValidations.validators.local.confirmation(password_element, options), "failed validation");
});

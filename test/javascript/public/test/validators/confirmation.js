vModule('Confirmation');

test('when values match', function() {
  var options = { message: "failed validation" };
  model.set({password: 'test', password_confirmation: 'test'});
  equal(ClientSideValidations.validators.local.confirmation(model, 'password', options), undefined);
});

test('when values do not match', function() {
  var options = { message: "failed validation" };
  model.set({password: 'test', password_confirmation: 'bad_test'});
  equal(ClientSideValidations.validators.local.confirmation(model, 'password', options), "failed validation");
});

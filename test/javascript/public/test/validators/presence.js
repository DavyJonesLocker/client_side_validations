vModule('Presence');

test('when value is not empty', function() {
  var options = { message: "failed validation" };
  model.set({name: 'test'})
  equal(ClientSideValidations.validators.local.presence(model, 'name', options), undefined);
});

test('when value is empty', function() {
  var options = { message: "failed validation" };
  model.set({name: ''});
  equal(ClientSideValidations.validators.local.presence(model, 'name', options), "failed validation");
});

test('when value is null', function() {
  var options = { message: "failed validation" };
  equal(ClientSideValidations.validators.local.presence(model, 'name', options), "failed validation");
});


vModule('Acceptance');

test('default value of \'1\'', function() {
  var options = { message: "failed validation" };
  model.set({accept: '1'});
  equal(ClientSideValidations.validators.local.acceptance(model, 'accept', options), undefined);
});

test('when value 2 and accept value is 2', function() {
  var options = { message: "failed validation", accept: 2 };
  model.set({accept: '2'});
  equal(ClientSideValidations.validators.local.acceptance(model, 'accept', options), undefined);
});

test('when value empty', function() {
  var options = { message: "failed validation" };
  model.set({accept: ''});
  equal(ClientSideValidations.validators.local.acceptance(model, 'accept', options), "failed validation");
});

test('when text and value 1 and accept value is 2', function() {
  var options = { message: "failed validation", accept: 2 };
  model.set({accept: '1'});
  equal(ClientSideValidations.validators.local.acceptance(model, 'accept', options), "failed validation");
});


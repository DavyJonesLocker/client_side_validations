vModule('Format');

test('when matching format', function() {
  var options = { 'message': "failed validation", 'with': /\d+/ };
  model.set({number: '123'});
  equal(ClientSideValidations.validators.local.format(model, 'number', options), undefined);
});

test('when not matching format', function() {
  var options = { 'message': "failed validation", 'with': /\d+/ };
  model.set({number: 'abc'});
  equal(ClientSideValidations.validators.local.format(model, 'number', options), "failed validation");
});

test('when allowing blank', function() {
  var options = { 'message': "failed validation", 'with': /\d+/, 'allow_blank': true };
  model.set({number: ''});
  equal(ClientSideValidations.validators.local.format(model, 'number', options), undefined);
});

test('when not allowing blank', function() {
  var options = { 'message': "failed validation", 'with': /\d+/ };
  model.set({number: ''});
  equal(ClientSideValidations.validators.local.format(model, 'number', options), "failed validation");
});

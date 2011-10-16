vModule('Inclusion');

test('when value is in the list', function() {
  var options = { 'message': "failed validation", 'in': [1, 2, 3] };
  model.set({item: '1'});
  equal(ClientSideValidations.validators.local.inclusion(model, 'item', options), undefined);
});

test('when value is in the range', function() {
  var options = { 'message': "failed validation", 'range': [1, 3] };
  model.set({item: '1'});
  equal(ClientSideValidations.validators.local.inclusion(model, 'item', options), undefined);
});

test('when value is not in the list', function() {
  var options = { 'message': "failed validation", 'in': [1, 2, 3] };
  model.set({item: '4'});
  equal(ClientSideValidations.validators.local.inclusion(model, 'item', options), "failed validation");
});

test('when value is not in the range', function() {
  var options = { 'message': "failed validation", 'range': [1, 3] };
  model.set({item: '4'});
  equal(ClientSideValidations.validators.local.inclusion(model, 'item', options), "failed validation");
});

test('when allowing blank', function() {
  var options = { 'message': "failed validation", 'in': [1, 2, 3], allow_blank: true };
  model.set({item: ''});
  equal(ClientSideValidations.validators.local.inclusion(model, 'item', options), undefined);
});

test('when not allowing blank', function() {
  var options = { 'message': "failed validation", 'in': [1, 2, 3] };
  model.set({item: ''});
  equal(ClientSideValidations.validators.local.inclusion(model, 'item', options), "failed validation");
});


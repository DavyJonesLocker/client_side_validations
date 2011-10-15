module('Exclusion options');

test('when value is not in the list', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'in': [1, 2, 3] };
  element.val('4');
  equal(ClientSideValidations.validators.local.exclusion(element, options), undefined);
});

test('when value is not in the range', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'range': [1, 3] };
  element.val('4');
  equal(ClientSideValidations.validators.local.exclusion(element, options), undefined);
});

test('when value is in the list', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'in': [1, 2, 3] };
  element.val('1');
  equal(ClientSideValidations.validators.local.exclusion(element, options), "failed validation");
});

test('when value is in the range', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'range': [1, 3] };
  element.val('1');
  equal(ClientSideValidations.validators.local.exclusion(element, options), "failed validation");
});

test('when allowing blank', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'in': [1, 2, 3], allow_blank: true };
  equal(ClientSideValidations.validators.local.exclusion(element, options), undefined);
});

test('when not allowing blank', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'in': [1, 2, 3] };
  equal(ClientSideValidations.validators.local.exclusion(element, options), "failed validation");
});

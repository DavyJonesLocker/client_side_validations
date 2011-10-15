module('Format options');

test('when matching format', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'with': /\d+/ };
  element.val('123');
  equal(ClientSideValidations.validators.local.format(element, options), undefined);
});

test('when not matching format', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'with': /\d+/ };
  element.val('abc');
  equal(ClientSideValidations.validators.local.format(element, options), "failed validation");
});

test('when allowing blank', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'with': /\d+/, 'allow_blank': true };
  equal(ClientSideValidations.validators.local.format(element, options), undefined);
});

test('when not allowing blank', function() {
  var element = $('<input type="text" />');
  var options = { 'message': "failed validation", 'with': /\d+/ };
  equal(ClientSideValidations.validators.local.format(element, options), "failed validation");
});

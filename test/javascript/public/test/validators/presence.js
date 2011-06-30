module('Presence options');

test('when value is not empty', function() {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  element.val('not empty');
  equal(clientSideValidations.validators.local.presence(element, options), undefined);
});

test('when value is empty', function() {
  var element = $('<input type="text" />');
  var options = { message: "failed validation" };
  equal(clientSideValidations.validators.local.presence(element, options), "failed validation");
});

test('when value is null from non-selected multi-select element', function() {
  var element = $('<select multiple="multiple />');
  var options = { message: "failed validation" };
  equal(clientSideValidations.validators.local.presence(element, options), "failed validation");
});


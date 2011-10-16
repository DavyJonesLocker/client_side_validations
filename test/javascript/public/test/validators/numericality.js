vModule('Numericality');

test('when value is a number', function() {
  var options = { message: "failed validation" };
  model.set({number: '123'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when value is a decimal number', function() {
  var options = { message: "failed validation" };
  model.set({number: '123.456'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when value is not a number', function() {
  var options = { messages: { numericality: "failed validation" } };
  model.set({number: 'abc123'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing integers and value is integer', function() {
  var options = { messages: { only_integer: "failed validation" }, only_integer: true };
  model.set({number: '123'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing integers and value is not integer', function() {
  var options = { messages: { only_integer: "failed validation" }, only_integer: true };
  model.set({number: '123.456'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing values greater than 10 and value is greater than 10', function() {
  var options = { messages: { greater_than: "failed validation" }, greater_than: 10 };
  model.set({number: '11'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing values greater than 10 and value is 10', function() {
  var options = { messages: { greater_than: "failed validation" }, greater_than: 10 };
  model.set({number: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing values greater than or equal to 10 and value is 10', function() {
  var options = { messages: { greater_than_or_equal_to: "failed validation" }, greater_than_or_equal_to: 10 };
  model.set({numbeR: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing values greater than or equal to 10 and value is 9', function() {
  var options = { messages: { greater_than_or_equal_to: "failed validation" }, greater_than_or_equal_to: 10 };
  model.set({number: '9'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing values less than 10 and value is less than 10', function() {
  var options = { messages: { less_than: "failed validation" }, less_than: 10 };
  model.set({number: '9'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing values less than 10 and value is 10', function() {
  var options = { messages: { less_than: "failed validation" }, less_than: 10 };
  model.set({number: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing values less than or equal to 10 and value is 10', function() {
  var options = { messages: { less_than_or_equal_to: "failed validation" }, less_than_or_equal_to: 10 };
  model.set({number: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing values less than or equal to 10 and value is 11', function() {
  var options = { messages: { less_than_or_equal_to: "failed validation" }, less_than_or_equal_to: 10 };
  model.set({number: '11'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing values equal to 10 and value is 10', function() {
  var options = { messages: { equal_to: "failed validation" }, equal_to: 10 };
  model.set({number: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing values equal to 10 and value is 11', function() {
  var options = { messages: { equal_to: "failed validation" }, equal_to: 10 };
  model.set({number: '11'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing value equal to 0 and value is 1', function() {
  var options = { messages: { equal_to: "failed validation" }, equal_to: 0 };
  model.set({number: '1'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing odd values and the value is odd', function() {
  var options = { messages: { odd: "failed validation" }, odd: true };
  model.set({number: '11'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing odd values and the value is even', function() {
  var options = { messages: { odd: "failed validation" }, odd: true };
  model.set({number: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});

test('when only allowing even values and the value is even', function() {
  var options = { messages: { even: "failed validation" }, even: true };
  model.set({number: '10'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), undefined);
});

test('when only allowing even values and the value is odd', function() {
  var options = { messages: { even: "failed validation" }, even: true };
  model.set({number: '11'});
  equal(ClientSideValidations.validators.local.numericality(model, 'number', options), "failed validation");
});


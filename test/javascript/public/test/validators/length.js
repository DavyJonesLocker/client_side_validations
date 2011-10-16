vModule('Length');

test('when allowed length is 3 and value length is 3', function() {
  var options = { messages: { is: "failed validation" }, is: 3 };
  model.set({number: '123'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), undefined);
});

test('when allowed length is 3 and value length is 4', function() {
  var options = { messages: { is: "failed validation" }, is: 3 };
  model.set({number: '1234'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), "failed validation");
});

test('when allowed length is 3 and value length is 2', function() {
  var options = { messages: { is: "failed validation" }, is: 3 };
  model.set({number: '12'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), "failed validation");
});

test('when allowing blank and allowed length is 3', function() {
  var options = { messages: { is: "failed validation" }, is: 3, allow_blank: true };
  model.set({number: ''});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), undefined);
});

test('when allowing blank and minimum length is 3 and maximum length is 100', function() {
  var options = { messages: { minimum: "failed minimum validation", maximum: "failed maximum validation" }, minimum: 3, maximum: 100, allow_blank: true };
  model.set({number: ''});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), undefined);
});

test('when not allowing blank and allowed length is 3', function() {
  var options = { messages: { is: "failed validation" }, is: 3 };
  model.set({number: ''});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), "failed validation");
});

test('when allowed length is 3 and a differnet tokenizer', function() {
  var options = { messages: { is: "failed validation" }, is: 3, js_tokenizer: "match(/\\w+/g)" };
  model.set({text: 'one two three'})
  equal(ClientSideValidations.validators.local.length(model, 'text', options), undefined);
});

test('when allowed length minimum is 3 and value length is 3', function() {
  var options = { messages: { is: "failed validation" }, is: 3 };
  model.set({number: '123'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), undefined);
});

test('when allowed length minimum is 3 and value length is 2', function() {
  var options = { messages: { minimum: "failed validation" }, minimum: 3 };
  model.set({number: '12'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), "failed validation");
});

test('when allowed length maximum is 3 and value length is 3', function() {
  var options = { messages: { is: "failed validation" }, is: 3 };
  model.set({number: '123'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), undefined);
});

test('when allowed length maximum is 3 and value length is 4', function() {
  var options = { messages: { maximum: "failed validation" }, maximum: 3 };
  model.set({number: '1234'});
  equal(ClientSideValidations.validators.local.length(model, 'number', options), "failed validation");
});


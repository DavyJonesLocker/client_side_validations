vModule('Uniqueness');

test('when matching a unique value on a non-nested resource', function() {
  var options = { 'message': "failed validation" };
  model.set({'user[email]': 'nottaken@test.com'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'user[email]', options), undefined);
});

test('when matching a non-unique value on a non-nested resource', function() {
  var options = { 'message': "failed validation" };
  model.set({'user[name]': 'taken@test.com'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'user[email]', options), "failed validation");
});

test('when matching unique value on a nested singular resource', function() {
  var options = { 'message': "failed validation" };
  model.set({'profile[user_attributes][email]': 'nottaken@test.com'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'profile[user_attributes][email]', options), undefined);
});

test('when matching a non-unique value on a nested singular resource', function() {
  var options = { 'message': "failed validation" };
  model.set({'profile[user_attributes][email]': 'taken@test.com'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'profile[user_attributes][email]', options), "failed validation");
});

test('when using scopes with no replacement', function() {
  var options = { 'message': "failed validation", 'scope': { 'name': 'test name' } };
  model.set({'person[age]': 'test'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'person[age]', options), "failed validation");
});

test('when using scopes with replacement', function() {
  var options = { 'message': "failed validation", 'scope': { 'name': 'test name' } };
  model.set({'person[age]': 'test', 'person[name]': 'other name'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'person[age]', options), undefined);
});

test('when validating by scope and mixed focus order', function() {
  var unique_element = $('#user_email'), scope_element = $('#user_name');
  unique_element.val('free@test.com');
  unique_element.trigger('change');
  unique_element.trigger('focusout');
  equal($('.message[for="user_email"]').text(), '');

  scope_element.val('test name');
  scope_element.trigger('change');
  scope_element.trigger('focusout');
  equal($('.message[for="user_email"]').text(), 'must be unique');
});

test('when matching uniqueness on a resource with a defined class name', function() {
  var options = { 'message': "failed validation", 'class': "active_record_test_module/user2" };
  model.set({'user[email]': 'nottaken@test.com'});
  equal(ClientSideValidations.validators.remote.uniqueness(model, 'user[email]', options), 'failed validation');
});

test('when allowing blank', function() {
 var options = { 'message': "failed validation", 'allow_blank': true };
 model.set({'user[email]': ''});
 equal(ClientSideValidations.validators.remote.uniqueness(model, 'user[email]', options), undefined);
});

test('when not allowing blank', function() {
 var options = { 'message': "failed validation" };
 model.set({'user[email]': ''});
 equal(ClientSideValidations.validators.remote.uniqueness(model, 'user[email]', options), "failed validation");
});

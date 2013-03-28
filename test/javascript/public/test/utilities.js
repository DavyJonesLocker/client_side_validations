module('Utilities');

test('Remote Validator Url without setting', function() {
  ClientSideValidations.remote_validators_prefix = undefined;
  equal(ClientSideValidations.remote_validators_url_for('test'), '//'+window.location.host'/validators/test');
});

test('Remote Validator Url with setting', function() {
  ClientSideValidations.remote_validators_prefix = 'other';
  equal(ClientSideValidations.remote_validators_url_for('test'), '//'+window.location.host+'/other/validators/test');
});

QUnit.module('Utilities');

QUnit.test('Remote Validator Url without setting', function(assert) {
  ClientSideValidations.remote_validators_prefix = undefined;
  assert.equal(ClientSideValidations.remote_validators_url_for('test'), '//'+window.location.host+'/validators/test');
});

QUnit.test('Remote Validator Url with setting', function(assert) {
  ClientSideValidations.remote_validators_prefix = 'other';
  assert.equal(ClientSideValidations.remote_validators_url_for('test'), '//'+window.location.host+'/other/validators/test');
});

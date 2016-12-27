QUnit.module('Disabling validators', {
  beforeEach: function() {
    ClientSideValidations.validators = {
      local: {
        test: function(){},
        test2: function(){}
      },
      remote: {
        test: function(){},
        test3: function(){}
      }
    }
  }
});

QUnit.test('when some validators are disabled', function(assert) {
  var keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  assert.deepEqual(keys, ['test', 'test3']);
  ClientSideValidations.disabled_validators = ['test'];
  ClientSideValidations.disableValidators();
  keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  assert.deepEqual(keys, ['test3']);
});

QUnit.test('when none of validators are disabled', function(assert) {
  var keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  assert.deepEqual(keys, ['test', 'test3']);
  ClientSideValidations.disabled_validators = [];
  ClientSideValidations.disableValidators();
  keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  assert.deepEqual(keys, ['test', 'test3']);
});

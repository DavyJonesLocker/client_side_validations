module('Disabling validators', {
  setup: function() {
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

test('when some validators are disabled', function() {
  var keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  deepEqual(keys, ['test', 'test3']);
  ClientSideValidations.disabled_validators = ['test'];
  ClientSideValidations.disableValidators();
  keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  deepEqual(keys, ['test3']);
});

test('when none of validators are disabled', function() {
  var keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  deepEqual(keys, ['test', 'test3']);
  ClientSideValidations.disabled_validators = [];
  ClientSideValidations.disableValidators();
  keys = []; for(var k in ClientSideValidations.validators.remote) keys.push(k);
  deepEqual(keys, ['test', 'test3']);
});

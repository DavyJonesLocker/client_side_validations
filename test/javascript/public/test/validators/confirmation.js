QUnit.module('Confirmation options', {
  beforeEach: function () {
    $('#qunit-fixture')
      .append('<input id="password" type="password" />')
      .append('<input id="password_confirmation" type="password" />')
      .append('<input id="username" type="text" />')
      .append('<input id="username_confirmation" type="text" />')
  }
})

QUnit.test('when values match (case sensitive)', function (assert) {
  var passwordElement = $('#password')
  var passwordConfirmationElement = $('#password_confirmation')
  var options = { message: 'failed validation' }
  passwordElement.val('test')
  passwordConfirmationElement.val('test')
  assert.equal(ClientSideValidations.validators.local.confirmation(passwordElement, options), undefined)
})

QUnit.test('when values do not match', function (assert) {
  var passwordElement = $('#password')
  var passwordConfirmationElement = $('#password_confirmation')
  var options = { message: 'failed validation' }
  passwordElement.val('test')
  passwordConfirmationElement.val('bad test')
  assert.equal(ClientSideValidations.validators.local.confirmation(passwordElement, options), 'failed validation')
})

QUnit.test('when values match (case insensitive)', function (assert) {
  var usernameElement = $('#username')
  var usernameConfirmationElement = $('#username_confirmation')
  var options = { message: 'failed validation' }
  usernameElement.val('tEsT')
  usernameConfirmationElement.val('test')
  assert.equal(ClientSideValidations.validators.local.confirmation(usernameElement, options), undefined)
})

QUnit.test('when values contain special characters', function (assert) {
  var usernameElement = $('#username')
  var usernameConfirmationElement = $('#username_confirmation')
  var options = { message: 'failed validation' }
  usernameElement.val('te+st')
  usernameConfirmationElement.val('te+st')
  assert.equal(ClientSideValidations.validators.local.confirmation(usernameElement, options), undefined)
})

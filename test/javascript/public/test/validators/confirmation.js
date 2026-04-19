QUnit.module('Confirmation options', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var password = document.createElement('input')
    var passwordConfirmation = document.createElement('input')
    var username = document.createElement('input')
    var usernameConfirmation = document.createElement('input')

    password.id = 'password'
    password.type = 'password'
    password.autocomplete = 'new-password'
    fixture.appendChild(password)

    passwordConfirmation.id = 'password_confirmation'
    passwordConfirmation.type = 'password'
    fixture.appendChild(passwordConfirmation)

    username.id = 'username'
    username.type = 'text'
    fixture.appendChild(username)

    usernameConfirmation.id = 'username_confirmation'
    usernameConfirmation.type = 'text'
    fixture.appendChild(usernameConfirmation)
  }
})

QUnit.test('when values match (case sensitive)', function (assert) {
  var passwordElement = document.getElementById('password')
  var passwordConfirmationElement = document.getElementById('password_confirmation')
  var options = { message: 'failed validation' }
  passwordElement.value = 'test'
  passwordConfirmationElement.value = 'test'
  assert.equal(ClientSideValidations.validators.local.confirmation(passwordElement, options), undefined)
})

QUnit.test('when values do not match', function (assert) {
  var passwordElement = document.getElementById('password')
  var passwordConfirmationElement = document.getElementById('password_confirmation')
  var options = { message: 'failed validation' }
  passwordElement.value = 'test'
  passwordConfirmationElement.value = 'bad test'
  assert.equal(ClientSideValidations.validators.local.confirmation(passwordElement, options), 'failed validation')
})

QUnit.test('when values match (case insensitive)', function (assert) {
  var usernameElement = document.getElementById('username')
  var usernameConfirmationElement = document.getElementById('username_confirmation')
  var options = { message: 'failed validation' }
  usernameElement.value = 'tEsT'
  usernameConfirmationElement.value = 'test'
  assert.equal(ClientSideValidations.validators.local.confirmation(usernameElement, options), undefined)
})

QUnit.test('when values contain special characters', function (assert) {
  var usernameElement = document.getElementById('username')
  var usernameConfirmationElement = document.getElementById('username_confirmation')
  var options = { message: 'failed validation' }
  usernameElement.value = 'te+st'
  usernameConfirmationElement.value = 'te+st'
  assert.equal(ClientSideValidations.validators.local.confirmation(usernameElement, options), undefined)
})

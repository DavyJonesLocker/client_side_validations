QUnit.module('Uniqueness options', {
  beforeEach: function () {
    ClientSideValidations.remote_validators_prefix = undefined
  }
})

QUnit.test('when matching local case-insensitive uniqueness for nested has-many resources', function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var user0EmailElement = document.createElement('input')
  var user1EmailElement = document.createElement('input')
  var options = { message: 'must be unique' }

  form.id = 'new_user_2'

  user0EmailElement.id = 'user_0_email'
  user0EmailElement.name = 'profile[user_attributes][0][email]'
  form.appendChild(user0EmailElement)

  user1EmailElement.id = 'user_1_email'
  user1EmailElement.name = 'profile[user_attributes][1][email]'
  form.appendChild(user1EmailElement)

  fixture.appendChild(form)

  user0EmailElement.value = 'not-locally-unique'
  user1EmailElement.value = 'Not-Locally-Unique'

  assert.equal(ClientSideValidations.validators.local.uniqueness(user1EmailElement, options), 'must be unique')
})

QUnit.test('when matching case-sensitive local uniqueness for nested has-many resources', function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var user0EmailElement = document.createElement('input')
  var user1EmailElement = document.createElement('input')
  var options = { message: 'must be unique', case_sensitive: true }

  form.id = 'new_user_3'

  user0EmailElement.id = 'user_0_email'
  user0EmailElement.name = 'profile[user_attributes][0][email]'
  form.appendChild(user0EmailElement)

  user1EmailElement.id = 'user_1_email'
  user1EmailElement.name = 'profile[user_attributes][1][email]'
  form.appendChild(user1EmailElement)

  fixture.appendChild(form)

  user0EmailElement.value = 'locally-unique'
  user1EmailElement.value = 'Locally-Unique'

  assert.equal(ClientSideValidations.validators.local.uniqueness(user1EmailElement, options), undefined)
})

QUnit.test('when local uniqueness is restored, sibling fields are re-marked with csv dataset keys', function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var user0EmailElement = document.createElement('input')
  var user1EmailElement = document.createElement('input')
  var options = { message: 'must be unique' }

  form.id = 'new_user_4'

  user0EmailElement.id = 'user_0_email'
  user0EmailElement.name = 'profile[user_attributes][0][email]'
  form.appendChild(user0EmailElement)

  user1EmailElement.id = 'user_1_email'
  user1EmailElement.name = 'profile[user_attributes][1][email]'
  form.appendChild(user1EmailElement)

  fixture.appendChild(form)

  user0EmailElement.value = 'not-locally-unique'
  user1EmailElement.value = 'Not-Locally-Unique'

  assert.equal(ClientSideValidations.validators.local.uniqueness(user1EmailElement, options), 'must be unique')
  assert.strictEqual(user0EmailElement.dataset.csvNotLocallyUnique, 'true')
  assert.strictEqual(user0EmailElement.dataset.notLocallyUnique, undefined)

  user1EmailElement.value = 'now-unique'

  assert.equal(ClientSideValidations.validators.local.uniqueness(user1EmailElement, options), undefined)
  assert.strictEqual(user0EmailElement.dataset.csvNotLocallyUnique, undefined)
  assert.strictEqual(user0EmailElement.dataset.csvChanged, 'true')
  assert.strictEqual(user0EmailElement.dataset.changed, undefined)
})

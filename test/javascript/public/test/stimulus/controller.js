// End-to-end tests for the Stimulus integration. These tests exercise the
// real `client-side-validations` Stimulus controller (connected via
// `window.Stimulus` in the test bundle) rather than the lifecycle helpers
// used elsewhere in the suite.

var stimulusSettings = {
  html_settings: {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
  },
  validators: { 'user[name]': { presence: [{ message: 'must be present' }] } }
}

var waitForStimulus = function () {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0)
  })
}

QUnit.module('Stimulus controller', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var form = document.createElement('form')

    form.action = '/users'
    form.method = 'post'
    form.id = 'stim_user'
    form.setAttribute('data-controller', 'client-side-validations')
    form.setAttribute('data-client-side-validations-settings-value', JSON.stringify(stimulusSettings))

    fixture.appendChild(form)
  }
})

QUnit.test('connect installs form context and applies novalidate', function (assert) {
  var done = assert.async()
  var form = document.getElementById('stim_user')

  waitForStimulus().then(function () {
    assert.ok(form.noValidate, 'form is marked novalidate')
    assert.ok(form.ClientSideValidations, 'form context is installed')
    assert.deepEqual(
      form.ClientSideValidations.settings.validators,
      stimulusSettings.validators,
      'settings are exposed from the controller value'
    )
    done()
  })
})

QUnit.test('input target bound on connect validates on focusout', function (assert) {
  var done = assert.async()
  var form = document.getElementById('stim_user')
  var input = document.createElement('input')

  input.type = 'text'
  input.name = 'user[name]'
  input.id = 'user_name'
  input.setAttribute('data-client-side-validations-target', 'input')
  form.appendChild(input)

  waitForStimulus().then(function () {
    input.dispatchEvent(new Event('focusout', { bubbles: true }))
    assert.ok(
      input.parentElement.classList.contains('field_with_errors'),
      'empty required input is flagged'
    )

    input.value = 'alice'
    input.dataset.csvChanged = 'true'
    input.dispatchEvent(new Event('focusout', { bubbles: true }))
    assert.notOk(
      input.parentElement.classList.contains('field_with_errors'),
      'valid input clears errors'
    )
    done()
  })
})

QUnit.test('dynamically inserted input target is bound', function (assert) {
  var done = assert.async()
  var form = document.getElementById('stim_user')

  waitForStimulus().then(function () {
    var input = document.createElement('input')
    input.type = 'text'
    input.name = 'user[name]'
    input.id = 'user_name'
    input.setAttribute('data-client-side-validations-target', 'input')
    form.appendChild(input)

    return waitForStimulus().then(function () {
      input.dispatchEvent(new Event('focusout', { bubbles: true }))
      assert.ok(
        input.parentElement.classList.contains('field_with_errors'),
        'late-added target is validated'
      )
      done()
    })
  })
})

QUnit.test('disconnect tears down form context when controller removed', function (assert) {
  var done = assert.async()
  var form = document.getElementById('stim_user')

  waitForStimulus().then(function () {
    form.removeAttribute('data-controller')
    return waitForStimulus()
  }).then(function () {
    assert.notOk(form.ClientSideValidations, 'form context removed')
    done()
  })
})

QUnit.test('submit on invalid form is prevented', function (assert) {
  var done = assert.async()
  var form = document.getElementById('stim_user')
  var input = document.createElement('input')

  input.type = 'text'
  input.name = 'user[name]'
  input.id = 'user_name'
  input.setAttribute('data-client-side-validations-target', 'input')
  form.appendChild(input)

  waitForStimulus().then(function () {
    form.requestSubmit()

    setTimeout(function () {
      var iframe = document.querySelector('iframe')
      var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')
      assert.notOk(response, 'form did not submit to server')
      assert.ok(
        input.parentElement.classList.contains('field_with_errors'),
        'invalid input is flagged after submit attempt'
      )
      done()
    }, 200)
  })
})

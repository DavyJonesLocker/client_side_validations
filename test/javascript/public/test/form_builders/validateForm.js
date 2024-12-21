QUnit.module('Validate Form', {
  beforeEach: function () {
    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: { 'user[name]': { presence: [{ message: 'must be present' }] } }
    }

    $('#qunit-fixture')
      .append($('<form>', {
        action: '/users',
        'data-client-side-validations': JSON.stringify(dataCsv),
        method: 'post',
        id: 'new_user'
      }))
      .find('form')
      .append($('<input />', {
        name: 'user[name]',
        id: 'user_name',
        type: 'text'
      }))
      .append($('<label for="user_name">Name</label>'))
    $('form#new_user').validate()
  }
})

QUnit.test('Validate form with invalid form (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  form.trigger('submit')

  setTimeout(function () {
    assert.ok(input.parent().hasClass('field_with_errors'))
    assert.ok(label.parent().hasClass('field_with_errors'))
    assert.ok(input.parent().find('label:contains("must be present")')[0])
    assert.notOk($('iframe').contents().find('p:contains("Form submitted")')[0])
    done()
  }, 250)
})

QUnit.test('Validate form with valid form (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')

  input.val('Test')

  form.trigger('submit')

  setTimeout(function () {
    assert.ok($('iframe').contents().find('p:contains("Form submitted")')[0])
    done()
  }, 250)
})

QUnit.test('Validate form with an input changed to false (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')

  input.val('Test')
  input[0].dataset.csvChanged = 'false'

  form.trigger('submit')

  setTimeout(function () {
    assert.ok($('iframe').contents().find('p:contains("Form submitted")')[0])
    done()
  }, 250)
})

QUnit.test('Ensure ajax:beforeSend is not from a bubbled event (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')

  form
    .append('<a>')
    .find('a').trigger('ajax:beforeSend')

  setTimeout(function () {
    assert.notOk(input.parent().hasClass('field_with_errors'))
    done()
  }, 250)
})

QUnit.test('Validate form with invalid form and disabling validations (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  form.disableClientSideValidations()
  form.trigger('submit')

  setTimeout(function () {
    assert.ok($('iframe').contents().find('p:contains("Form submitted")')[0])
    done()
  }, 250)
})

QUnit.test('Handle disable-with (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  form.append($('<input />', {
    type: 'submit',
    'data-disable-with': 'Waiting...',
    name: 'commit',
    value: 'Save',
    id: 'submit_button'
  }))

  form.trigger('submit')

  setTimeout(function () {
    assert.ok($('#submit_button').attr('disabled') === undefined)
    done()
  }, 250)
})

QUnit.test('Disabled inputs do not stop form submission (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  input.disableClientSideValidations()
  form.trigger('submit')

  setTimeout(function () {
    assert.ok($('iframe').contents().find('p:contains("Form submitted")')[0])
    done()
  }, 250)
})

QUnit.test('Decorative (without name) inputs aren\'t validated (async)', function (assert) {
  var done = assert.async()
  var form = $('form#new_user')
  var input = form.find('input#user_name')

  input.val('Test')
  form.append($('<input />', { type: 'text' })).validate()

  form.trigger('submit')

  setTimeout(function () {
    assert.ok($('iframe').contents().find('p:contains("Form submitted")')[0])
    done()
  }, 250)
})

QUnit.test('Resetting client side validations', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  form.trigger('submit')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
  assert.ok(input.parent().find('label:contains("must be present")')[0])

  form.resetClientSideValidations()
  assert.notOk(input.parent().hasClass('field_with_errors'))
  assert.notOk(label.parent().hasClass('field_with_errors'))
  assert.notOk(input.parent().find('label:contains("must be present")')[0])

  form.trigger('submit')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
  assert.ok(input.parent().find('label:contains("must be present")')[0])
})

QUnit.test('Disable client side validations on all child inputs', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  form.disableClientSideValidations()

  input.trigger('focusout')

  assert.notOk(input.parent().hasClass('field_with_errors'))
  assert.notOk(label.parent().hasClass('field_with_errors'))
  assert.notOk(input.parent().find('label:contains("must be present")')[0])
})

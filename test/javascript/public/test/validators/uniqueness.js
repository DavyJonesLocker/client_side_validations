QUnit.module('Uniqueness options', {
  beforeEach: function () {
    ClientSideValidations.remote_validators_prefix = undefined
    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: { 'user[email]': { uniqueness: [{ message: 'must be unique', scope: { name: 'pass' } }] }, presence: [{ message: 'must be present' }] }
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
      .append($('<input />', {
        name: 'user[email]',
        id: 'user_email',
        type: 'text'
      }))

    $('form#new_user').validate()
  }
})

QUnit.test('when matching local case-insensitive uniqueness for nested has-many resources', function (assert) {
  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user[email]': { uniqueness: [{ message: 'must be unique' }] } }
  }

  $('#qunit-fixture')
    .append($('<form>', {
      action: '/users',
      'data-client-side-validations': JSON.stringify(dataCsv),
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
    .append($('<input />', {
      name: 'profile[user_attributes][0][email]',
      id: 'user_0_email'
    }))
    .append($('<input />', {
      name: 'profile[user_attributes][1][email]',
      id: 'user_1_email'
    }))

  $('form#new_user_2').validate()

  var user0EmailElement = $('#user_0_email')
  var user1EmailElement = $('#user_1_email')
  var options = { message: 'must be unique' }

  user0EmailElement.val('not-locally-unique')
  user1EmailElement.val('Not-Locally-Unique')

  assert.equal(ClientSideValidations.validators.local.uniqueness(user1EmailElement, options), 'must be unique')
})

QUnit.test('when matching case-sensitive local uniqueness for nested has-many resources', function (assert) {
  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user[email]': { uniqueness: [{ message: 'must be unique' }] } }
  }

  $('#qunit-fixture')
    .append($('<form>', {
      action: '/users',
      'data-client-side-validations': JSON.stringify(dataCsv),
      method: 'post',
      id: 'new_user_3'
    }))
    .find('form')
    .append($('<input />', {
      name: 'profile[user_attributes][0][email]',
      id: 'user_0_email'
    }))
    .append($('<input />', {
      name: 'profile[user_attributes][1][email]',
      id: 'user_1_email'
    }))

  $('form#new_user_3').validate()

  var user0EmailElement = $('#user_0_email')
  var user1EmailElement = $('#user_1_email')
  var options = { message: 'must be unique', case_sensitive: true }

  user0EmailElement.val('locally-unique')
  user1EmailElement.val('Locally-Unique')

  assert.equal(ClientSideValidations.validators.local.uniqueness(user1EmailElement, options), undefined)
})

QUnit.module('Uniqueness options', {
  beforeEach: function() {
    ClientSideValidations.remote_validators_prefix = undefined;
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {'user[email]':{"uniqueness":[{"message": "must be unique", "scope":{'name':"pass"}}]},"presence":[{"message": "must be present"}]}
    }

    $('#qunit-fixture')
      .append($('<form />', {
        action: '/users',
        'data-validate': true,
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

    $('form#new_user').validate();
  }
});

QUnit.test('when matching local uniqueness for nested has-many resources', function(assert) {
  $('#qunit-fixture')
    .append($('<form />', {
      action: '/users',
      'data-validate': true,
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
      .append($('<input />', {
        name: 'profile[user_attributes][0][email]',
        id: 'user_0_email',
      }))
      .append($('<input />', {
        name: 'profile[user_attributes][1][email]',
        id: 'user_1_email',
      }));

  ClientSideValidations.forms['new_user_2'] = {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    validators: { 'user[email]':{"uniqueness":[{"message": "must be unique"}]}}
  }
  $('form#new_user_2').validate();

  var user_0_email = $('#user_0_email'),
      user_1_email = $('#user_1_email'),
      options = { 'message': "must be unique" };

  user_0_email.val('not-locally-unique');
  user_1_email.val('not-locally-unique');

  assert.equal(ClientSideValidations.validators.local.uniqueness(user_1_email, options), "must be unique");
});

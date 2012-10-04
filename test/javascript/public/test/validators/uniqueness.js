module('Uniqueness options', {
  setup: function() {
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

// test('when matching uniqueness on a non-nested resource', function() {
  // var element = $('<input type="text" name="user[email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('nottaken@test.com');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), undefined);
// });

// test('when matching uniqueness on a non-nested resource', function() {
  // var element = $('<input type="text" name="user[email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('taken@test.com');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), "failed validation");
// });

// test('when matching uniqueness on a nested singular resource', function() {
  // var element = $('<input type="text" name="profile[user_attributes][email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('nottaken@test.com');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), undefined);
// });

// test('when matching uniqueness on a nested singular resource', function() {
  // var element = $('<input type="text" name="profile[user_attributes][email]"/>');
  // var options = { 'message': "failed validation" };
  // element.val('taken@test.com');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), "failed validation");
// });

// test('when using scopes with no replacement', function() {
  // var element = $('<input type="text" name="person[age]" />');
  // var options = { 'message': "failed validation", 'with': /\d+/, 'scope': { 'name': 'test name' } };
  // element.val('test');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), "failed validation");
// });

// test('when using scopes with replacement', function() {
  // var element = $('<input type="text" name="person[age]" />');
  // var options = { 'message': "failed validation", 'with': /\d+/, 'scope': { 'name': 'test name' } };
  // element.val('test')
  // $('#qunit-fixture').append('<input type="text" name="person[name]" />').find('input[name="person[name]"]').val('other name');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), undefined);
// });

// test('when validating by scope and mixed focus order', function() {
  // var unique_element = $('#user_email'), scope_element = $('#user_name');
  // unique_element.val('free@test.com');
  // unique_element.trigger('change');
  // unique_element.trigger('focusout');
  // equal($('.message[for="user_email"]').text(), '');

  // scope_element.val('test name');
  // scope_element.trigger('change');
  // scope_element.trigger('focusout');
  // equal($('.message[for="user_email"]').text(), 'must be unique');
// });

test('when using scopes with replacement as checkboxes', function() {
  var element = $('<input type="text" name="person[age]" />');
  var options = { 'message': "failed validation", 'with': /\d+/, 'scope': { 'name': 'test name' } };
  element.val('test')
  $('#qunit-fixture')
    .append('<input type="hidden" name="person[name]" value="other name"')
    .append('<input type="checkbox" name="person[name]" value="test name"/>')
    .find('input[name="person[name]"]').val('other name');
  equal(ClientSideValidations.validators.remote.uniqueness(element, options), undefined);
  $('[name="person[name]"]:checkbox')[0].checked = true;
  equal(ClientSideValidations.validators.remote.uniqueness(element, options), 'failed validation');
});

// test('when matching uniqueness on a resource with a defined class name', function() {
  // var element = $('<input type="text" name="user2[email]"/>');
  // var options = { 'message': "failed validation", 'class': "active_record_test_module/user2" };
  // element.val('nottaken@test.com');
  // equal(ClientSideValidations.validators.remote.uniqueness(element, options), 'failed validation');
// });

// test('when allowing blank', function() {
 // var element = $('<input type="text" name="user2[email]" />');
 // var options = { 'message': "failed validation", 'with': /\d+/, 'allow_blank': true };
 // equal(ClientSideValidations.validators.remote.uniqueness(element, options), undefined);
// });

// test('when not allowing blank', function() {
 // var element = $('<input type="text" name="user2[email]" />');
 // var options = { 'message': "failed validation", 'with': /\d+/ };
 // equal(ClientSideValidations.validators.remote.uniqueness(element, options), "failed validation");
// });

// test('when matching local uniqueness for nested has-many resources', function() {
  // $('#qunit-fixture')
    // .append($('<form />', {
      // action: '/users',
      // 'data-validate': true,
      // method: 'post',
      // id: 'new_user_2'
    // }))
    // .find('form')
      // .append($('<input />', {
        // name: 'profile[user_attributes][0][email]',
        // id: 'user_0_email',
      // }))
      // .append($('<input />', {
        // name: 'profile[user_attributes][1][email]',
        // id: 'user_1_email',
      // }));

  // ClientSideValidations.forms['new_user_2'] = {
    // type: 'ActionView::Helpers::FormBuilder',
    // input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    // label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    // validators: { 'user[email]':{"uniqueness":[{"message": "must be unique"}]}}
  // }
  // $('form#new_user_2').validate();

  // var user_0_email = $('#user_0_email'),
      // user_1_email = $('#user_1_email'),
      // options = { 'message': "must be unique" };

  // user_0_email.val('not-locally-unique');
  // user_1_email.val('not-locally-unique');

  // equal(ClientSideValidations.validators.remote.uniqueness(user_1_email, options), undefined);
  // equal(ClientSideValidations.validators.local.uniqueness(user_1_email, options), "must be unique");
// });

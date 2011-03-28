module('Validate Element', {
  setup: function() {
    new_user = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>'
    }

    $('#qunit-fixture')
      .append($('<form />', {
        action: '/users',
        'data-validate': true,
        method: 'post',
        id: 'new_user'
      }))
      .find('form')
        .append($('<label for="user_name">Name</label>'))
        .append($('<input />', {
          name: 'user[name]',
          id: 'user_name',
          'data-validators': '{"presence":{"message": "must be present"}, "format":{"message":"is invalid","with":/\\d+/}}',
          type: 'text'
        }))
        .append($('<label for="user_password">Password</label>'))
        .append($('<input />', {
          name: 'user[password]',
          id: 'user_password',
          'data-validators': '{"confirmation":{"message": "must match confirmation"}}',
          type: 'password'
        }))
        .append($('<label for="user_password_confirmation">Password Confirmation</label>'))
        .append($('<input />', {
          name: 'user[password_confirmation]',
          id: 'user_password_confirmation',
          type: 'password'
        }))
        .append($('<label for="user_agree">Agree</label>'))
        .append($('<input />', {
          name: 'user[agree]',
          id: 'user_agree',
          'data-validators': '{"acceptance": {"message": "must be accepted"}}',
          type: 'checkbox',
          value: 1
        }))
        .append($('<input />', {
          name: 'user[email]',
          id: 'user_email',
          'data-validators': '{"uniqueness":{"message": "must be unique"},"presence":{"message": "must be present"}}',
          type: 'text'
        }))

    $('form#new_user').validate();
  }
});

test('Validate when focusouting', function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
});

test('Validate when checkbox is clicked', function() {
  var form = $('form#new_user'), input = form.find('input#user_agree');
  var label = $('label[for="user_agree"]');

  input.attr('checked', false)
  input.trigger('click');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
});

test('Validate when focusout on confirmation', function() {
  var form = $('form#new_user'), password = form.find('input#user_password'), confirmation = form.find('input#user_password_confirmation');
  var label = $('label[for="user_password"]');

  password.val('password');
  confirmation.trigger('focusout');
  ok(password.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
});

test('Validate when keyup on confirmation', function() {
  var form = $('form#new_user'), password = form.find('input#user_password'), confirmation = form.find('input#user_password_confirmation');
  var label = $('label[for="user_password"]');

  password.val('password');

  confirmation.trigger('keyup');
  ok(password.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  confirmation.val('password')
  confirmation.trigger('keyup');
  ok(!password.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));
});

test('Forcing remote validators to run last', function() {
  var form = $('form#new_user'), input = form.find('input#user_email');

  input.trigger('focusout');
  equal(input.parent().find('label').text(), "must be present")
});

test("Don't validate when value hasn't changed", function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  input.val('123');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  input.trigger('change');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));
});

test('Validate when error message needs to change', function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.trigger('focusout');
  equal(input.parent().find('label.message').text(), "must be present");
  input.val('abc');
  input.trigger('change')
  input.trigger('focusout');
  equal(input.parent().find('label.message').text(), "is invalid");
});


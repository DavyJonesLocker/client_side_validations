module('Validate Element', {
  setup: function() {
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {
        'user[name]':{"presence":{"message": "must be present"}, "format":{"message":"is invalid","with":/\d+/}},
        'user[password]':{"confirmation":{"message": "must match confirmation"}},
        'user[agree]':{"acceptance": {"message": "must be accepted"}},
        'user[email]':{"uniqueness":{"message": "must be unique"},"presence":{"message": "must be present"}}
      }
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
          'data-validate': 'true',
          type: 'text'
        }))
        .append($('<label for="user_password">Password</label>'))
        .append($('<input />', {
          name: 'user[password]',
          id: 'user_password',
          'data-validate': 'true',
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
          'data-validate': 'true',
          type: 'checkbox',
          value: 1
        }))
        .append($('<input />', {
          name: 'user[email]',
          id: 'user_email',
          'data-validate': 'true',
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
})

test("Don't validate confirmation when not a validatable input", function() {
  $('#qunit-fixture')
    .append($('<form />', {
      action: '/users',
      'data-validate': true,
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
      .append($('<label for="user_2_password">Password</label>'))
      .append($('<input />', {
        name: 'user_2[password]',
        id: 'user_2_password',
        type: 'password'
      }))
      .append($('<label for="user_2_password_confirmation">Password Confirmation</label>'))
      .append($('<input />', {
        name: 'user_2[password_confirmation]',
        id: 'user_2_password_confirmation',
        type: 'password'
      }))
  ClientSideValidations.forms['new_user_2'] = {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    validators: { }
  }
  $('form#new_user_2').validate();
  var form = $('form#new_user_2'), input = form.find('input#user_2_password_confirmation');
  input.val('123');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
});

test("Don't validate inputs with 'data-validate' not set to true", function() {
  $('#qunit-fixture')
    .append($('<form />', {
      action: '/users',
      'data-validate': true,
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
      .append($('<label for="user_2_name">name</label>'))
      .append($('<input />', {
        name: 'user_2[name]',
        id: 'user_2_name',
        type: 'name',
        'data-validate': false
      }))
  ClientSideValidations.forms['new_user_2'] = {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    validators: { }
  }
  $('form#new_user_2').validate();
  var form = $('form#new_user_2'), input = form.find('input#user_2_name');
  input.val('123');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
});

test("Don't validate inputs with 'data-validate' that are dynamically set to false", function() {
  $('#qunit-fixture')
    .append($('<form />', {
      action: '/users',
      'data-validate': true,
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
      .append($('<label for="user_2_name">name</label>'))
      .append($('<input />', {
        name: 'user_2[name]',
        id: 'user_2_name',
        type: 'name',
        'data-validate': 'true'
      }))
  ClientSideValidations.forms['new_user_2'] = {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    validators: { 'user_2[name]':{"presence":{"message": "must be present"}}}
  }
  $('form#new_user_2').validate();
  var form = $('form#new_user_2'), input = form.find('input#user_2_name');
  input.attr('data-validate', false);
  input.val('');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
});

test("Don't validate disabled inputs", function() {
  $('#qunit-fixture')
    .append($('<form />', {
      action: '/users',
      'data-validate': true,
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
      .append($('<label for="user_2_name">name</label>'))
      .append($('<input />', {
        name: 'user_2[name]',
        id: 'user_2_name',
        type: 'name',
        'data-validate': 'true',
        disabled: 'disabled'
      }))
  ClientSideValidations.forms['new_user_2'] = {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    validators: { 'user_2[name]':{"presence":{"message": "must be present"}}}
  }
  $('form#new_user_2').validate();
  var form = $('form#new_user_2'), input = form.find('input#user_2_name');
  input.val('');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
});

test("Don't validate dynamically disabled inputs", function() {
  $('#qunit-fixture')
    .append($('<form />', {
      action: '/users',
      'data-validate': true,
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
      .append($('<label for="user_2_name">name</label>'))
      .append($('<input />', {
        name: 'user_2[name]',
        id: 'user_2_name',
        type: 'name',
        'data-validate': 'true'
      }))
  ClientSideValidations.forms['new_user_2'] = {
    type: 'ActionView::Helpers::FormBuilder',
    input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
    label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
    validators: { 'user_2[name]':{"presence":{"message": "must be present"}}}
  }
  $('form#new_user_2').validate();
  var form = $('form#new_user_2'), input = form.find('input#user_2_name');
  input.attr('disabled', 'disabled');
  input.val('');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
});

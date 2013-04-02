module('Validate Element', {
  setup: function() {
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {
        'user[name]':{"presence":[{"message": "must be present"}], "format":[{"message":"is invalid","with":/\d+/}]},
        'user[password]':{"confirmation":[{"message": "must match confirmation"}]},
        'user[agree]':{"acceptance": [{"message": "must be accepted"}]},
        'user[email]':{"uniqueness":[{"message": "must be unique"}],"presence":[{"message": "must be present"}]},
        'user[info_attributes][eye_color]':{"presence":[{"message": "must be present"}]},
        'user[phone_numbers_attributes][][number]':{"presence":[{"message": "must be present"}]},
        'user[phone_numbers_attributes][country_code][][code]':{"presence":[{"message": "must be present"}]},
        'user[phone_numbers_attributes][deeply][nested][][attribute]':{"presence":[{"message": "must be present"}]}
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
          type: 'text'
        }))
        .append($('<label for="user_password">Password</label>'))
        .append($('<input />', {
          name: 'user[password]',
          id: 'user_password',
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
          type: 'checkbox',
          value: 1
        }))
        .append($('<input />', {
          name: 'user[email]',
          id: 'user_email',
          type: 'text'
        }))
        .append($('<label for="user_phone_numbers_attributes_0_number">Phone Number</label>'))
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][0][number]',
          id: 'user_phone_numbers_attributes_0_number',
          type: 'text'
        })
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][0][_destroy]',
          id: 'user_phone_numbers_attributes_0__destroy',
          type: 'hidden',
          value: "1"
        })))
        .append($('<label for="user_phone_numbers_attributes_1_number">Phone Number</label>'))
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][1][number]',
          id: 'user_phone_numbers_attributes_1_number',
          type: 'text'
        }))
        .append($('<label for="user_phone_numbers_attributes_new_1234_number">Phone Number</label>'))
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][new_1234][number]',
          id: 'user_phone_numbers_attributes_new_1234_number',
          type: 'text'
        }))
        .append($('<label for="user_phone_numbers_attributes_country_code_0_code">Country code</label>'))
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][country_code][0][code]',
          id: 'user_phone_numbers_attributes_country_code_0_code',
          type: 'text'
        }))
        .append($('<label for="user_phone_numbers_attributes_deeply_nested_0_attribute">Deeply nested attribute</label>'))
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][deeply][nested][0][attribute]',
          id: 'user_phone_numbers_attributes_deeply_nested_0_attribute',
          type: 'text'
        }))
        .append($('<label for="user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute">Deeply nested attribute</label>'))
        .append($('<input />', {
          name: 'user[phone_numbers_attributes][deeply][nested][5154ce728c06dedad4000001][attribute]',
          id: 'user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute',
          type: 'text'
        }))
        .append($('<label for="user_info_attributes_eye_color">Eye Color</label>'))
        .append($('<input />', {
          name: 'user[info_attributes][eye_color]',
          id: 'user_info_attributes_eye_color',
          type: 'text'
        }));

    $('form#new_user').validate();
  },

  teardown: function() {
    $('#qunit-fixture').remove('form');
    delete ClientSideValidations.forms.new_user;
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

  input.prop('checked', false)
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

test('Validate nested attributes', function() {
  var form = $('form#new_user'), input, label;

  input = form.find('input#user_phone_numbers_attributes_1_number');
  label = $('label[for="user_phone_numbers_attributes_1_number"]');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  input = form.find('input#user_phone_numbers_attributes_0_number');
  label = $('label[for="user_phone_numbers_attributes_0_number"]');
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));

  input = form.find('input#user_phone_numbers_attributes_new_1234_number');
  label = $('label[for="user_phone_numbers_attributes_new_1234_number"]');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  input = form.find('input#user_phone_numbers_attributes_country_code_0_code');
  label = $('label[for="user_phone_numbers_attributes_country_code_0_code"]');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  input = form.find('input#user_phone_numbers_attributes_deeply_nested_0_attribute');
  label = $('label[for="user_phone_numbers_attributes_deeply_nested_0_attribute"]');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));

  input = form.find('input#user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute');
  label = $('label[for="user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute"]');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
});

test('Validate additional attributes', function() {
  var form = $('form#new_user'), input, label;

  input = form.find('input#user_info_attributes_eye_color');
  label = $('label[for="user_info_attributes_eye_color"]');
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
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

test('ensure label is scoped to form', function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  $('#qunit-fixture')
    .prepend($('<form />', { id: 'other_form', 'data-validate': true })
    .append($('<label for="user_name">Name</label>')));

  var otherLabel = $('form#other_form').find('label')

  input.trigger('focusout');
  ok(!otherLabel.parent().hasClass('field_with_errors'));
});

test("Return validation result", function() {
  var input = $('#user_name');

  ok(!input.isValid(ClientSideValidations.forms['new_user'].validators));

  input.val('123').data('changed', true);
  ok(input.isValid(ClientSideValidations.forms['new_user'].validators));
});

test('Validate when focusouting and field has disabled validations', function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.disableClientSideValidations();
  input.trigger('focusout');
  ok(!input.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));

  input.enableClientSideValidations();
  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
});

QUnit.module('Validate Element', {
  beforeEach: function () {
    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="class_one class_two field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: {
        'user[name]': { presence: [{ message: 'must be present' }], format: [{ message: 'is invalid', 'with': { options: 'g', source: '\\d+' } }] },
        'user[password]': { confirmation: [{ message: 'must match confirmation' }] },
        'user[agree]': { acceptance: [{ message: 'must be accepted' }] },
        'user[email]': { uniqueness: [{ message: 'must be unique' }], presence: [{ message: 'must be present' }] },
        'user[info_attributes][eye_color]': { presence: [{ message: 'must be present' }] },
        'user[phone_numbers_attributes][][number]': { presence: [{ message: 'must be present' }] },
        'user[phone_numbers_attributes][2][number]': { length: [{ messages: { minimum: 'is too short (minimum is 4 characters)' }, minimum: 4 }] },
        'user[phone_numbers_attributes][country_code][][code]': { presence: [{ message: 'must be present' }] },
        'user[phone_numbers_attributes][deeply][nested][][attribute]': { presence: [{ message: 'must be present' }] },
        'user[phone_numbers_attributes][][labels_attributes][][label]': { presence: [{ message: 'must be present' }] },
        'user[a_attributes][][b_attributes][][c_attributes][][d_attributes][][e]': { presence: [{ message: 'must be present' }] },
        customized_field: { length: [{ messages: { minimum: 'is too short (minimum is 4 characters)' }, minimum: 4 }] }
      }
    }

    $('#qunit-fixture')
      .append($('<form>', {
        action: '/users',
        'data-client-side-validations': JSON.stringify(dataCsv),
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
      }))
      .append($('<input />', {
        name: 'user[phone_numbers_attributes][0][_destroy]',
        id: 'user_phone_numbers_attributes_0__destroy',
        type: 'hidden',
        value: '1'
      }))
      .append($('<label for="user_phone_numbers_attributes_1_number">Phone Number</label>'))
      .append($('<input />', {
        name: 'user[phone_numbers_attributes][1][number]',
        id: 'user_phone_numbers_attributes_1_number',
        type: 'text'
      }))
      .append($('<label for="user_phone_numbers_attributes_2_number">Phone Number</label>'))
      .append($('<input />', {
        name: 'user[phone_numbers_attributes][2][number]',
        id: 'user_phone_numbers_attributes_2_number',
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
      .append($('<label for="user_phone_numbers_attributes_1_labels_attributes_2_label">Two rails-nested-attributes</label>'))
      .append($('<input />', {
        name: 'user[phone_numbers_attributes][1][labels_attributes][2][label]',
        id: 'user_phone_numbers_attributes_1_labels_attributes_2_label',
        type: 'text'
      }))
      .append($('<label for="user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e">Two rails-nested-attributes</label>'))
      .append($('<input />', {
        name: 'user[a_attributes][1][b_attributes][2][c_attributes][3][d_attributes][4][e]',
        id: 'user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e',
        type: 'text'
      }))
      .append($('<label for="user_info_attributes_eye_color">Eye Color</label>'))
      .append($('<input />', {
        name: 'user[info_attributes][eye_color]',
        id: 'user_info_attributes_eye_color',
        type: 'text'
      }))
      .append($('<label for="customized_field">Customized Field</label>'))
      .append($('<input />', {
        name: 'customized_field',
        id: 'customized_field',
        type: 'text'
      }))

    $('form#new_user').validate()
  },

  afterEach: function () {
    $('#qunit-fixture').remove('form')
  }
})

QUnit.test('Validate when focusouting on customized_field', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#customized_field')
  var label = $('label[for="customized_field"]')

  input.val('1')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate when focusouting', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate when checkbox is clicked', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_agree')
  var label = $('label[for="user_agree"]')

  input.prop('checked', true)
  input.trigger('click')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate when focusout on confirmation', function (assert) {
  var form = $('form#new_user')
  var password = form.find('input#user_password')
  var confirmation = form.find('input#user_password_confirmation')
  var label = $('label[for="user_password"]')

  password.val('password')
  confirmation.trigger('focusout')
  assert.ok(password.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate nested attributes', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_phone_numbers_attributes_1_number')
  var label = $('label[for="user_phone_numbers_attributes_1_number"]')

  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_phone_numbers_attributes_0_number')
  label = $('label[for="user_phone_numbers_attributes_0_number"]')
  input.trigger('focusout')
  assert.notOk(input.parent().hasClass('field_with_errors'))
  assert.notOk(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_phone_numbers_attributes_new_1234_number')
  label = $('label[for="user_phone_numbers_attributes_new_1234_number"]')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_phone_numbers_attributes_country_code_0_code')
  label = $('label[for="user_phone_numbers_attributes_country_code_0_code"]')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_phone_numbers_attributes_deeply_nested_0_attribute')
  label = $('label[for="user_phone_numbers_attributes_deeply_nested_0_attribute"]')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute')
  label = $('label[for="user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute"]')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_phone_numbers_attributes_1_labels_attributes_2_label')
  label = $('label[for="user_phone_numbers_attributes_1_labels_attributes_2_label"]')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input = form.find('input#user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e')
  label = $('label[for="user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e"]')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate nested attributes with custom validation', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_phone_numbers_attributes_2_number')
  var label = $('label[for="user_phone_numbers_attributes_2_number"]')

  input.val('1')
  input.trigger('focusout')
  assert.equal(input.parent().find('label').text(), 'is too short (minimum is 4 characters)')
})

QUnit.test('Validate additional attributes', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_info_attributes_eye_color')
  var label = $('label[for="user_info_attributes_eye_color"]')

  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate when keyup on confirmation', function (assert) {
  var form = $('form#new_user')
  var password = form.find('input#user_password')
  var confirmation = form.find('input#user_password_confirmation')
  var label = $('label[for="user_password"]')

  password.val('password')

  confirmation.trigger('keyup')
  assert.ok(password.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  confirmation.val('password')
  confirmation.trigger('keyup')
  assert.notOk(password.parent().hasClass('field_with_errors'))
  assert.notOk(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Forcing remote validators to run last', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_email')

  input.trigger('focusout')
  assert.equal(input.parent().find('label').text(), 'must be present')
})

QUnit.test("Don't validate when value hasn't changed", function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input.val('123')
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))

  input.trigger('change')
  input.trigger('focusout')
  assert.notOk(input.parent().hasClass('field_with_errors'))
  assert.notOk(label.parent().hasClass('field_with_errors'))
})

QUnit.test('Validate when error message needs to change', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  input.trigger('focusout')
  assert.equal(input.parent().find('label.message').text(), 'must be present')
  input.val('abc')
  input.trigger('change')
  input.trigger('focusout')
  assert.equal(input.parent().find('label.message').text(), 'is invalid')
})

QUnit.test("Don't validate confirmation when not a validatable input", function (assert) {
  dataCsv = {
    html_options: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { }
  }

  $('#qunit-fixture')
    .append($('<form>', {
      action: '/users',
      'data-client-side-validations': JSON.stringify(dataCsv),
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

  $('form#new_user_2').validate()
  var form = $('form#new_user_2')
  var input = form.find('input#user_2_password_confirmation')

  input.val('123')
  input.trigger('focusout')
  assert.notOk(input.parent().hasClass('field_with_errors'))
})

QUnit.test("Don't validate disabled inputs", function (assert) {
  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user_2[name]': { presence: { message: 'must be present' } } }
  }

  $('#qunit-fixture')
    .append($('<form>', {
      action: '/users',
      'data-client-side-validations': JSON.stringify(dataCsv),
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
    .append($('<label for="user_2_name">name</label>'))
    .append($('<input />', {
      name: 'user_2[name]',
      id: 'user_2_name',
      type: 'text',
      disabled: 'disabled'
    }))

  $('form#new_user_2').validate()
  var form = $('form#new_user_2')
  var input = form.find('input#user_2_name')

  input.val('')
  input.trigger('focusout')
  assert.notOk(input.parent().hasClass('field_with_errors'))
})

QUnit.test("Don't validate dynamically disabled inputs", function (assert) {
  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user_2[name]': { presence: { message: 'must be present' } } }
  }

  $('#qunit-fixture')
    .append($('<form>', {
      action: '/users',
      'data-client-side-validations': JSON.stringify(dataCsv),
      method: 'post',
      id: 'new_user_2'
    }))
    .find('form')
    .append($('<label for="user_2_name">name</label>'))
    .append($('<input />', {
      name: 'user_2[name]',
      id: 'user_2_name',
      type: 'text'
    }))
  $('form#new_user_2').validate()
  var form = $('form#new_user_2')
  var input = form.find('input#user_2_name')

  input.attr('disabled', 'disabled')
  input.val('')
  input.trigger('focusout')
  assert.notOk(input.parent().hasClass('field_with_errors'))
})

QUnit.test('ensure label is scoped to form', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  $('#qunit-fixture')
    .prepend($('<form>', { id: 'other_form', 'data-client-side-validations': {}.to_json })
      .append($('<label for="user_name">Name</label>')))

  var otherLabel = $('form#other_form').find('label')

  input.trigger('focusout')
  assert.notOk(otherLabel.parent().hasClass('field_with_errors'))
})

QUnit.test('Return validation result', function (assert) {
  var input = $('#user_name')

  assert.notOk(input.isValid(dataCsv.validators))

  input.val('123').data('changed', true)
  assert.ok(input.isValid(dataCsv.validators))
})

QUnit.test('Validate when focusouting and field has disabled validations', function (assert) {
  var form = $('form#new_user')
  var input = form.find('input#user_name')
  var label = $('label[for="user_name"]')

  input.disableClientSideValidations()
  input.trigger('focusout')
  assert.notOk(input.parent().hasClass('field_with_errors'))
  assert.notOk(label.parent().hasClass('field_with_errors'))

  input.enableClientSideValidations()
  input.trigger('focusout')
  assert.ok(input.parent().hasClass('field_with_errors'))
  assert.ok(label.parent().hasClass('field_with_errors'))
})

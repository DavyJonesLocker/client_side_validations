QUnit.module('Validate Element', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var form = document.createElement('form')
    var labelUserName = document.createElement('label')
    var inputUserName = document.createElement('input')
    var labelPassword = document.createElement('label')
    var inputPassword = document.createElement('input')
    var labelPasswordConfirmation = document.createElement('label')
    var inputPasswordConfirmation = document.createElement('input')
    var labelAgree = document.createElement('label')
    var inputAgree = document.createElement('input')
    var inputEmail = document.createElement('input')
    var labelPhone0 = document.createElement('label')
    var inputPhone0 = document.createElement('input')
    var inputPhone0Destroy = document.createElement('input')
    var labelPhone1 = document.createElement('label')
    var inputPhone1 = document.createElement('input')
    var labelPhone2 = document.createElement('label')
    var inputPhone2 = document.createElement('input')
    var labelPhoneNew = document.createElement('label')
    var inputPhoneNew = document.createElement('input')
    var labelCountryCode = document.createElement('label')
    var inputCountryCode = document.createElement('input')
    var labelDeepNested0 = document.createElement('label')
    var inputDeepNested0 = document.createElement('input')
    var labelDeepNestedObjectId = document.createElement('label')
    var inputDeepNestedObjectId = document.createElement('input')
    var labelLabelsNested = document.createElement('label')
    var inputLabelsNested = document.createElement('input')
    var labelDeepAttributes = document.createElement('label')
    var inputDeepAttributes = document.createElement('input')
    var labelEyeColor = document.createElement('label')
    var inputEyeColor = document.createElement('input')
    var labelCustomizedField = document.createElement('label')
    var inputCustomizedField = document.createElement('input')

    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
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

    form.action = '/users'
    form.dataset.clientSideValidations = JSON.stringify(dataCsv)
    form.method = 'post'
    form.id = 'new_user'

    labelUserName.htmlFor = 'user_name'
    labelUserName.textContent = 'Name'
    form.appendChild(labelUserName)

    inputUserName.name = 'user[name]'
    inputUserName.id = 'user_name'
    inputUserName.type = 'text'
    form.appendChild(inputUserName)

    labelPassword.htmlFor = 'user_password'
    labelPassword.textContent = 'Password'
    form.appendChild(labelPassword)

    inputPassword.name = 'user[password]'
    inputPassword.id = 'user_password'
    inputPassword.type = 'password'
    form.appendChild(inputPassword)

    labelPasswordConfirmation.htmlFor = 'user_password_confirmation'
    labelPasswordConfirmation.textContent = 'Password Confirmation'
    form.appendChild(labelPasswordConfirmation)

    inputPasswordConfirmation.name = 'user[password_confirmation]'
    inputPasswordConfirmation.id = 'user_password_confirmation'
    inputPasswordConfirmation.type = 'password'
    form.appendChild(inputPasswordConfirmation)

    labelAgree.htmlFor = 'user_agree'
    labelAgree.textContent = 'Agree'
    form.appendChild(labelAgree)

    inputAgree.name = 'user[agree]'
    inputAgree.id = 'user_agree'
    inputAgree.type = 'checkbox'
    inputAgree.value = '1'
    form.appendChild(inputAgree)

    inputEmail.name = 'user[email]'
    inputEmail.id = 'user_email'
    inputEmail.type = 'text'
    form.appendChild(inputEmail)

    labelPhone0.htmlFor = 'user_phone_numbers_attributes_0_number'
    labelPhone0.textContent = 'Phone Number'
    form.appendChild(labelPhone0)

    inputPhone0.name = 'user[phone_numbers_attributes][0][number]'
    inputPhone0.id = 'user_phone_numbers_attributes_0_number'
    inputPhone0.type = 'text'
    form.appendChild(inputPhone0)

    inputPhone0Destroy.name = 'user[phone_numbers_attributes][0][_destroy]'
    inputPhone0Destroy.id = 'user_phone_numbers_attributes_0__destroy'
    inputPhone0Destroy.type = 'hidden'
    inputPhone0Destroy.value = '1'
    form.appendChild(inputPhone0Destroy)

    labelPhone1.htmlFor = 'user_phone_numbers_attributes_1_number'
    labelPhone1.textContent = 'Phone Number'
    form.appendChild(labelPhone1)

    inputPhone1.name = 'user[phone_numbers_attributes][1][number]'
    inputPhone1.id = 'user_phone_numbers_attributes_1_number'
    inputPhone1.type = 'text'
    form.appendChild(inputPhone1)

    labelPhone2.htmlFor = 'user_phone_numbers_attributes_2_number'
    labelPhone2.textContent = 'Phone Number'
    form.appendChild(labelPhone2)

    inputPhone2.name = 'user[phone_numbers_attributes][2][number]'
    inputPhone2.id = 'user_phone_numbers_attributes_2_number'
    inputPhone2.type = 'text'
    form.appendChild(inputPhone2)

    labelPhoneNew.htmlFor = 'user_phone_numbers_attributes_new_1234_number'
    labelPhoneNew.textContent = 'Phone Number'
    form.appendChild(labelPhoneNew)

    inputPhoneNew.name = 'user[phone_numbers_attributes][new_1234][number]'
    inputPhoneNew.id = 'user_phone_numbers_attributes_new_1234_number'
    inputPhoneNew.type = 'text'
    form.appendChild(inputPhoneNew)

    labelCountryCode.htmlFor = 'user_phone_numbers_attributes_country_code_0_code'
    labelCountryCode.textContent = 'Country code'
    form.appendChild(labelCountryCode)

    inputCountryCode.name = 'user[phone_numbers_attributes][country_code][0][code]'
    inputCountryCode.id = 'user_phone_numbers_attributes_country_code_0_code'
    inputCountryCode.type = 'text'
    form.appendChild(inputCountryCode)

    labelDeepNested0.htmlFor = 'user_phone_numbers_attributes_deeply_nested_0_attribute'
    labelDeepNested0.textContent = 'Deeply nested attribute'
    form.appendChild(labelDeepNested0)

    inputDeepNested0.name = 'user[phone_numbers_attributes][deeply][nested][0][attribute]'
    inputDeepNested0.id = 'user_phone_numbers_attributes_deeply_nested_0_attribute'
    inputDeepNested0.type = 'text'
    form.appendChild(inputDeepNested0)

    labelDeepNestedObjectId.htmlFor = 'user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute'
    labelDeepNestedObjectId.textContent = 'Deeply nested attribute'
    form.appendChild(labelDeepNestedObjectId)

    inputDeepNestedObjectId.name = 'user[phone_numbers_attributes][deeply][nested][5154ce728c06dedad4000001][attribute]'
    inputDeepNestedObjectId.id = 'user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute'
    inputDeepNestedObjectId.type = 'text'
    form.appendChild(inputDeepNestedObjectId)

    labelLabelsNested.htmlFor = 'user_phone_numbers_attributes_1_labels_attributes_2_label'
    labelLabelsNested.textContent = 'Two rails-nested-attributes'
    form.appendChild(labelLabelsNested)

    inputLabelsNested.name = 'user[phone_numbers_attributes][1][labels_attributes][2][label]'
    inputLabelsNested.id = 'user_phone_numbers_attributes_1_labels_attributes_2_label'
    inputLabelsNested.type = 'text'
    form.appendChild(inputLabelsNested)

    labelDeepAttributes.htmlFor = 'user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e'
    labelDeepAttributes.textContent = 'Two rails-nested-attributes'
    form.appendChild(labelDeepAttributes)

    inputDeepAttributes.name = 'user[a_attributes][1][b_attributes][2][c_attributes][3][d_attributes][4][e]'
    inputDeepAttributes.id = 'user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e'
    inputDeepAttributes.type = 'text'
    form.appendChild(inputDeepAttributes)

    labelEyeColor.htmlFor = 'user_info_attributes_eye_color'
    labelEyeColor.textContent = 'Eye Color'
    form.appendChild(labelEyeColor)

    inputEyeColor.name = 'user[info_attributes][eye_color]'
    inputEyeColor.id = 'user_info_attributes_eye_color'
    inputEyeColor.type = 'text'
    form.appendChild(inputEyeColor)

    labelCustomizedField.htmlFor = 'customized_field'
    labelCustomizedField.textContent = 'Customized Field'
    form.appendChild(labelCustomizedField)

    inputCustomizedField.name = 'customized_field'
    inputCustomizedField.id = 'customized_field'
    inputCustomizedField.type = 'text'
    form.appendChild(inputCustomizedField)

    fixture.appendChild(form)

    ClientSideValidations.validate(form)
  },

  afterEach: function () {
    document.getElementById('qunit-fixture').replaceChildren()
  }
})

QUnit.test('Validate when focusouting on customized_field', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('customized_field')
  var label = form.querySelector('label[for="customized_field"]')

  input.value = '1'
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate when focusouting', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate when checkbox is clicked', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_agree')
  var label = form.querySelector('label[for="user_agree"]')

  input.checked = true
  input.click()
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate when focusout on confirmation', function (assert) {
  var form = document.getElementById('new_user')
  var password = document.getElementById('user_password')
  var confirmation = document.getElementById('user_password_confirmation')
  var label = form.querySelector('label[for="user_password"]')

  password.value = 'password'
  confirmation.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(password.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate nested attributes', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_phone_numbers_attributes_1_number')
  var label = form.querySelector('label[for="user_phone_numbers_attributes_1_number"]')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_phone_numbers_attributes_0_number')
  label = form.querySelector('label[for="user_phone_numbers_attributes_0_number"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
  assert.notOk(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_phone_numbers_attributes_new_1234_number')
  label = form.querySelector('label[for="user_phone_numbers_attributes_new_1234_number"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_phone_numbers_attributes_country_code_0_code')
  label = form.querySelector('label[for="user_phone_numbers_attributes_country_code_0_code"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_phone_numbers_attributes_deeply_nested_0_attribute')
  label = form.querySelector('label[for="user_phone_numbers_attributes_deeply_nested_0_attribute"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute')
  label = form.querySelector('label[for="user_phone_numbers_attributes_deeply_nested_5154ce728c06dedad4000001_attribute"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_phone_numbers_attributes_1_labels_attributes_2_label')
  label = form.querySelector('label[for="user_phone_numbers_attributes_1_labels_attributes_2_label"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input = document.getElementById('user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e')
  label = form.querySelector('label[for="user_a_attributes_1_b_attributes_2_c_attributes_3_d_attributes_4_e"]')
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate nested attributes with custom validation', function (assert) {
  var input = document.getElementById('user_phone_numbers_attributes_2_number')

  input.value = '1'
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.equal(input.parentElement.querySelector('label.message').textContent, 'is too short (minimum is 4 characters)')
})

QUnit.test('Validate additional attributes', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_info_attributes_eye_color')
  var label = form.querySelector('label[for="user_info_attributes_eye_color"]')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate when keyup on confirmation', function (assert) {
  var form = document.getElementById('new_user')
  var password = document.getElementById('user_password')
  var confirmation = document.getElementById('user_password_confirmation')
  var label = form.querySelector('label[for="user_password"]')

  password.value = 'password'

  confirmation.dispatchEvent(new Event('keyup', { bubbles: true }))
  assert.ok(password.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  confirmation.value = 'password'
  confirmation.dispatchEvent(new Event('keyup', { bubbles: true }))
  assert.notOk(password.parentElement.classList.contains('field_with_errors'))
  assert.notOk(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Forcing remote validators to run last', function (assert) {
  var input = document.getElementById('user_email')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.equal(input.parentElement.querySelector('label.message').textContent, 'must be present')
})

QUnit.test("Don't validate when value hasn't changed", function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input.value = '123'
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))

  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
  assert.notOk(label.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Validate when error message needs to change', function (assert) {
  var input = document.getElementById('user_name')

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.equal(input.parentElement.querySelector('label.message').textContent, 'must be present')
  input.value = 'abc'
  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.equal(input.parentElement.querySelector('label.message').textContent, 'is invalid')
})

QUnit.test("Don't validate confirmation when not a validatable input", function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var labelPassword = document.createElement('label')
  var inputPassword = document.createElement('input')
  var labelPasswordConfirmation = document.createElement('label')
  var inputPasswordConfirmation = document.createElement('input')

  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: {}
  }

  fixture.replaceChildren()

  form.action = '/users'
  form.dataset.clientSideValidations = JSON.stringify(dataCsv)
  form.method = 'post'
  form.id = 'new_user_2'

  labelPassword.htmlFor = 'user_2_password'
  labelPassword.textContent = 'Password'
  form.appendChild(labelPassword)

  inputPassword.name = 'user_2[password]'
  inputPassword.id = 'user_2_password'
  inputPassword.type = 'password'
  form.appendChild(inputPassword)

  labelPasswordConfirmation.htmlFor = 'user_2_password_confirmation'
  labelPasswordConfirmation.textContent = 'Password Confirmation'
  form.appendChild(labelPasswordConfirmation)

  inputPasswordConfirmation.name = 'user_2[password_confirmation]'
  inputPasswordConfirmation.id = 'user_2_password_confirmation'
  inputPasswordConfirmation.type = 'password'
  form.appendChild(inputPasswordConfirmation)

  fixture.appendChild(form)

  ClientSideValidations.validate(form)

  inputPasswordConfirmation.value = '123'
  inputPasswordConfirmation.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.notOk(inputPasswordConfirmation.parentElement.classList.contains('field_with_errors'))
})

QUnit.test("Don't validate disabled inputs", function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var label = document.createElement('label')
  var input = document.createElement('input')

  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user_2[name]': { presence: [{ message: 'must be present' }] } }
  }

  fixture.replaceChildren()

  form.action = '/users'
  form.dataset.clientSideValidations = JSON.stringify(dataCsv)
  form.method = 'post'
  form.id = 'new_user_2'

  label.htmlFor = 'user_2_name'
  label.textContent = 'name'
  form.appendChild(label)

  input.name = 'user_2[name]'
  input.id = 'user_2_name'
  input.type = 'text'
  input.disabled = true
  form.appendChild(input)

  fixture.appendChild(form)

  ClientSideValidations.validate(form)

  input.value = ''
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
})

QUnit.test("Don't validate dynamically disabled inputs", function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var label = document.createElement('label')
  var input = document.createElement('input')

  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user_2[name]': { presence: [{ message: 'must be present' }] } }
  }

  fixture.replaceChildren()

  form.action = '/users'
  form.dataset.clientSideValidations = JSON.stringify(dataCsv)
  form.method = 'post'
  form.id = 'new_user_2'

  label.htmlFor = 'user_2_name'
  label.textContent = 'name'
  form.appendChild(label)

  input.name = 'user_2[name]'
  input.id = 'user_2_name'
  input.type = 'text'
  form.appendChild(input)

  fixture.appendChild(form)

  ClientSideValidations.validate(form)

  input.disabled = true
  input.value = ''
  input.dispatchEvent(new Event('focusout', { bubbles: true }))

  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
})

QUnit.test("Remove error messages when input tag has more than two css classes", function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.createElement('form')
  var label = document.createElement('label')
  var input = document.createElement('input')

  dataCsv = {
    html_settings: {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="input_class_one input_class_two field_with_errors"><span id="input_tag"></span><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="label_class_one label_class_two field_with_errors"><label id="label_tag"></label></div>'
    },
    validators: { 'user_2[name]': { presence: [{ message: 'must be present' }] } }
  }

  fixture.replaceChildren()

  form.action = '/users'
  form.dataset.clientSideValidations = JSON.stringify(dataCsv)
  form.method = 'post'
  form.id = 'new_user_2'

  label.htmlFor = 'user_2_name'
  label.textContent = 'name'
  form.appendChild(label)

  input.name = 'user_2[name]'
  input.id = 'user_2_name'
  input.type = 'text'
  form.appendChild(input)

  fixture.appendChild(form)

  ClientSideValidations.validate(form)

  input.value = ''
  input.dispatchEvent(new Event('focusout', { bubbles: true }))

  assert.ok(input.parentElement.classList.contains('field_with_errors'))

  input.value = '123'
  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.dispatchEvent(new Event('focusout', { bubbles: true }))

  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
  assert.equal(form.querySelectorAll('.field_with_errors').length, 0)
})

QUnit.test('ensure label is scoped to form', function (assert) {
  var fixture = document.getElementById('qunit-fixture')
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var otherForm = document.createElement('form')
  var otherLabel = document.createElement('label')

  otherForm.id = 'other_form'
  otherForm.dataset.clientSideValidations = '{}'

  otherLabel.htmlFor = 'user_name'
  otherLabel.textContent = 'Name'
  otherForm.appendChild(otherLabel)

  fixture.prepend(otherForm)

  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.notOk(otherLabel.parentElement.classList.contains('field_with_errors'))
})

QUnit.test('Return validation result', function (assert) {
  var input = document.getElementById('user_name')

  assert.notOk(ClientSideValidations.isValid(input, dataCsv.validators))

  input.value = '123'
  input.dataset.csvChanged = 'true'
  assert.ok(ClientSideValidations.isValid(input, dataCsv.validators))
})

QUnit.test('Validate when focusouting and field has disabled validations', function (assert) {
  var form = document.getElementById('new_user')
  var input = document.getElementById('user_name')
  var label = form.querySelector('label[for="user_name"]')

  ClientSideValidations.disable(input)
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.notOk(input.parentElement.classList.contains('field_with_errors'))
  assert.notOk(label.parentElement.classList.contains('field_with_errors'))

  ClientSideValidations.enable(input)
  input.dispatchEvent(new Event('focusout', { bubbles: true }))
  assert.ok(input.parentElement.classList.contains('field_with_errors'))
  assert.ok(label.parentElement.classList.contains('field_with_errors'))
})

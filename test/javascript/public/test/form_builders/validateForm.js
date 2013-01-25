module('Validate Form', {
  setup: function() {
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {'user[name]':{"presence":[{"message": "must be present"}]}}
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
        .append($('<label for="user_name">Name</label>'));
    $('form#new_user').validate();
  }
});

asyncTest('Validate form with invalid form', 4, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok(input.parent().hasClass('field_with_errors'));
    ok(label.parent().hasClass('field_with_errors'));
    ok(input.parent().find('label:contains("must be present")')[0]);
    ok(!$('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 60);
});

asyncTest('Validate form with valid form', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  input.val('Test');

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 60);
});

asyncTest('Validate form with an input changed to false', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  input.val('Test');
  input.attr('changed', false);
  input.attr('data-valid', true);

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 60);
});

asyncTest('Ensure ajax:beforeSend is not from a bubbled event', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');

  form
    .append('<a />')
    .find('a').trigger('ajax:beforeSend');
  setTimeout(function() {
    start();
    ok(!input.parent().hasClass('field_with_errors'));
  });
});

asyncTest('Validate form with invalid form and disabling validations', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  form.disableClientSideValidations();
  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 100);
});

test('Resetting client side validations', 9, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  form.trigger('submit');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
  ok(input.parent().find('label:contains("must be present")')[0]);

  form.resetClientSideValidations();
  ok(!input.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));
  ok(!input.parent().find('label:contains("must be present")')[0]);

  form.trigger('submit');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
  ok(input.parent().find('label:contains("must be present")')[0]);
});

test('Disable client side validations on all child inputs', 3, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  form.disableClientSideValidations();

  input.trigger('focusout');

  ok(!input.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));
  ok(!input.parent().find('label:contains("must be present")')[0]);
});

asyncTest('Handle disable-with', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');
  form.append($('<input />', {
    type:                'submit',
    'data-disable-with': 'Waiting...',
    name:                'commit',
    value:               'Save',
    id:                  'submit_button'
  }));

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('#submit_button').attr('disabled') === undefined)
  }, 60);
});

asyncTest('Disabled inputs do not stop form submission', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.disableClientSideValidations()
  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 60);
});

asyncTest('Decorative (without name) inputs aren\'t validated', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  input.val('Test');
  form.append($('<input />', {type: 'text'})).validate();

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 60);
});

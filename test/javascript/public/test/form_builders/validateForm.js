module('Validate Form', {
  setup: function() {
    ClientSideValidations.forms['new_user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {'user[name]':{"presence":{"message": "must be present"}}}
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
          'data-validate': 'true',
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
  }, 30);
});

asyncTest('Validate form with valid form', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  input.val('Test');

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 30);
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
  }, 30);
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

module('Validate SimpleForm', {
  setup: function() {
    new_user = {
      type: 'SimpleForm::FormBuilder',
      error_class: 'error',
      error_tag: 'span',
      wrapper_error_class: 'field_with_errors',
      wrapper_tag: 'div'
    }

    $('#qunit-fixture')
      .append($('<form />', {
        action: '/users',
        'data-validate': true,
        method: 'post',
        id: 'new_user'
      }))
      .find('form')
        .append('<div />').find('div')
          .append($('<input />', {
            name: 'user[name]',
            id: 'user_name',
            'data-validators': '{presence:{message: "must be present"}, format:{message:"is invalid",with:/\\d+/}}',
            type: 'text'
          }))
          .append($('<label for="user_name">Name</label>'));
    $('form#new_user').validate();
  }
});

test('Validate error attaching and detaching', function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.trigger('focusout');
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
  ok(input.parent().find('span.error:contains("must be present")')[0]);

  input.val('abc')
  input.trigger('change')
  input.trigger('focusout')
  ok(input.parent().hasClass('field_with_errors'));
  ok(label.parent().hasClass('field_with_errors'));
  ok(input.parent().find('span.error:contains("is invalid")')[0]);

  input.val('123')
  input.trigger('change')
  input.trigger('focusout')
  ok(!input.parent().hasClass('field_with_errors'));
  ok(!label.parent().hasClass('field_with_errors'));
  ok(!input.parent().find('span.error')[0]);
});


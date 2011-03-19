module('Validate Formtastic', {
  setup: function() {
    new_user = {
      type: 'Formtastic::SemanticFormBuilder',
      inline_error_class: 'inline-errors'
    }

    $('#qunit-fixture')
      .append($('<form />', {
        action: '/users',
        'data-validate': true,
        method: 'post',
        id: 'new_user'
      }))
      .find('form')
        .append('<li />').find('li')
          .append($('<input />', {
            name: 'user[name]',
            id: 'user_name',
            'data-validators': '{presence:{message: "must be present"}, format:{message:"is invalid",with:/\\d+/}}',
            type: 'text'
          }))
          .append($('<label for="user_name">Name</label>'));
  }
});

test('Validate error attaching and detaching', function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  input.trigger('blur')
  ok(input.parent().hasClass('error'));
  ok(label.parent().hasClass('error'));
  ok(input.parent().find('p.inline-errors:contains("must be present")')[0]);

  input.val('abc')
  input.trigger('change')
  input.trigger('blur')
  ok(input.parent().hasClass('error'));
  ok(label.parent().hasClass('error'));
  ok(input.parent().find('p.inline-errors:contains("is invalid")')[0]);

  input.val('123')
  input.trigger('change')
  input.trigger('blur')
  ok(!input.parent().hasClass('error'));
  ok(!label.parent().hasClass('error'));
  ok(!input.parent().find('p.inline-errors')[0]);
});


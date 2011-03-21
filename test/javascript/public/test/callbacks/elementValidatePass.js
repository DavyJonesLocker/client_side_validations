module('Element Validate Pass Callback', {
  setup: function() {
    new_user = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>'
    }

    $('#qunit-fixture')
      .append($('<span id="result" />'))
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
          'data-validators': '{presence:{message: "must be present"}}',
          type: 'text'
        }))
        .append($('<label for="user_name">Name</label>'));

    clientSideValidations.elementValidatePass = function(element) {
      $('#result').text('Element Validate Pass ' + element.attr('id'));
    }
  },
  teardown: function() {
    clientSideValidations.elementValidatePass = function(element) {}
  }
});

test('runs callback when form element validate', function() {
  var input = $('input');

  equal($('#result').text(), '');

  input.val('')
  input.trigger('change');
  input.trigger('focusout');
  equal($('#result').text(), '');

  input.val('test')
  input.trigger('change');
  input.trigger('focusout');
  equal($('#result').text(), 'Element Validate Pass user_name');
});

test('runs callback when form validates', function() {
  var form = $('form'), input = form.find('input');

  equal($('#result').text(), '');

  input.val('')
  input.trigger('change');
  form.trigger('submit');

  equal($('#result').text(), '');

  input.val('test')
  input.trigger('change');
  form.trigger('submit');

  equal($('#result').text(), 'Element Validate Pass user_name');
});


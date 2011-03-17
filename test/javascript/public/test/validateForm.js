module('Validate Form', {
  setup: function() {
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
          'data-validators': '{presence:{message: "must be present"}}',
          type: 'text'
        }))
        .append($('<label for="user_name">Name</label>'))
        .append($('<input type="submit" data-disable-with="submitting ..." name="submit2" value="Submit" />'));
  }
});

var new_user = {
  type: 'ActionView::Helpers::FormBuilder',
  input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name"></label></div>',
  label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>'
}

asyncTest('Validate for with invalid form', 3, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  // WEEIRDD: attaching this handler makes the test work in IE7
  form.bind('iframe:loading', function(e, form) {});

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok(input.parent().hasClass('field_with_errors'));
    ok(label.parent().hasClass('field_with_errors'));
    ok(!$('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 30);
});

asyncTest('Validate for with valid form', 1, function() {
  var form = $('form#new_user'), input = form.find('input#user_name');
  input.val('Test');

  // WEEIRDD: attaching this handler makes the test work in IE7
  form.bind('iframe:loading', function(e, form) {});

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok($('iframe').contents().find('p:contains("Form submitted")')[0]);
  }, 30);
});


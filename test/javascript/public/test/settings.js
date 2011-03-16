var App = App || {};

App.assert_callback_invoked = function(callback_name) {
  ok(true, callback_name + ' callback should have been invoked');
};

App.assert_callback_not_invoked = function(callback_name) {
  ok(false, callback_name + ' callback should not have been invoked');
};

App.assert_get_request = function(request_env){
  equal(request_env['REQUEST_METHOD'], 'GET', 'request type should be GET');
};

App.assert_post_request = function(request_env){
  equal(request_env['REQUEST_METHOD'], 'POST', 'request type should be POST');
};

App.assert_request_path = function(request_env, path) {
  equal(request_env['PATH_INFO'], path, 'request should be sent to right url');
};

// hijacks normal form submit; lets it submit to an iframe to prevent
// navigating away from the test suite
$(document).bind('submit', function(e) {
  if (!e.isDefaultPrevented()) {
    var form = $(e.target), action = form.attr('action'),
        name = 'form-frame' + jQuery.guid++,
        iframe = $('<iframe name="' + name + '" />');

    if (action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
    form.attr('target', name);
    $('#qunit-fixture').append(iframe);
    $.event.trigger('iframe:loading', form);
  }
});

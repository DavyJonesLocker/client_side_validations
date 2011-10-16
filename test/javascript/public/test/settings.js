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
    form.trigger('iframe:loading');
  }
});

// The mock model object used throughout the validator tests
var model = {
  attributes: {},
  get: function(attr) {
    return this.attributes[attr];
  },
  clear: function() {
    this.attributes = {};
  },
  set: function(attrs) {
    for(var attr in attrs) {
      this.attributes[attr] = attrs[attr];
    }
  }
}

var vModule = function(description) {
  module(description, {
    teardown: function() {
      model.clear();
    }
  });
}

QUnit.config.urlConfig.push({
  id: 'jquery',
  label: 'jQuery version',
  value: ['3.5.0', '3.5.0.slim', '3.4.1', '3.4.1.slim', '3.3.1', '3.3.1.slim', '3.2.1', '3.2.1.slim', '3.1.1', '3.1.1.slim', '3.0.0', '3.0.0.slim', '2.2.4', '2.1.4', '2.0.3', '1.12.4', '1.11.3'],
  tooltip: 'What jQuery Core version to test against'
})

/* Hijacks normal form submit; lets it submit to an iframe to prevent
 * navigating away from the test suite
 */
$(document).on('submit', function (e) {
  if (!e.isDefaultPrevented()) {
    var form = $(e.target)
    var action = form.attr('action')
    var name = 'form-frame' + jQuery.guid++
    var iframe = $('<iframe name="' + name + '" />')

    if (action && action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
    form.attr('target', name)
    $('#qunit-fixture').append(iframe)
    form.trigger('iframe:loading')
  }
})

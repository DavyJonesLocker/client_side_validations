QUnit.config.autostart = window.location.search.search('autostart=false') < 0

QUnit.config.urlConfig.push({
  id: 'jquery',
  label: 'jQuery version',
  value: ['3.7.1', '3.7.1.slim'],
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
    var iframe = $('<iframe>', { name: name })

    if (action && action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
    form.attr('target', name)
    $('#qunit-fixture').append(iframe)
    form.trigger('iframe:loading')
  }
})

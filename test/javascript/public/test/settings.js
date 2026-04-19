QUnit.config.autostart = window.location.search.search('autostart=false') < 0

var iframeSequence = 0

/* Hijacks normal form submit; lets it submit to an iframe to prevent
 * navigating away from the test suite
 */
document.addEventListener('submit', function (event) {
  if (event.defaultPrevented || !(event.target instanceof HTMLFormElement)) {
    return
  }

  var form = event.target
  var action = form.getAttribute('action')
  var name = 'form-frame' + iframeSequence++
  var iframe = document.createElement('iframe')

  iframe.name = name

  if (action && action.indexOf('iframe') < 0) form.setAttribute('action', action + '?iframe=true')
  form.setAttribute('target', name)
  document.getElementById('qunit-fixture').appendChild(iframe)
  form.dispatchEvent(new CustomEvent('iframe:loading', { bubbles: true }))
})

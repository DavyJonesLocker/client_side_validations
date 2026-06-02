const createFakeWidget = () => {
  return {
    handlers: {},
    on (eventName, handler) {
      this.handlers[eventName] = this.handlers[eventName] || []
      this.handlers[eventName].push(handler)
    },
    off (eventName, handler) {
      this.handlers[eventName] = (this.handlers[eventName] || []).filter((registeredHandler) => {
        return registeredHandler !== handler
      })
    },
    trigger (eventName) {
      ;(this.handlers[eventName] || []).slice().forEach((handler) => {
        handler()
      })
    },
    handlerCount (eventName) {
      return (this.handlers[eventName] || []).length
    }
  }
}

QUnit.module('Adapters', {
  beforeEach: function () {
    var fixture = document.getElementById('qunit-fixture')
    var form = document.createElement('form')
    var wrapper = document.createElement('div')
    var label = document.createElement('label')
    var select = document.createElement('select')
    var blankOption = document.createElement('option')
    var validOption = document.createElement('option')
    var proxy = document.createElement('input')

    ClientSideValidations.adapters.items = []

    ClientSideValidations.adapters.register({
      matches: function (element) {
        return element.matches('select[data-csv-adapter="fake-select"]')
      },
      bind: function (element, validate) {
        var events = ['change', 'blur', 'dropdown_close']

        events.forEach(function (eventName) {
          element.fakeWidget.on(eventName, validate)
        })

        return function () {
          events.forEach(function (eventName) {
            element.fakeWidget.off(eventName, validate)
          })
        }
      },
      addError: function (element, message) {
        var adapterWrapper = element.closest('.adapter-field')
        var adapterProxy = adapterWrapper.querySelector('[data-csv-adapter-proxy]')
        var errorElement = adapterWrapper.querySelector('.csv-adapter-error')

        if (!errorElement) {
          errorElement = document.createElement('div')
          errorElement.className = 'csv-adapter-error'
          errorElement.id = element.id + '_adapter_error'
          adapterWrapper.appendChild(errorElement)
        }

        adapterProxy.classList.add('is-invalid')
        adapterProxy.setAttribute('aria-invalid', 'true')
        adapterProxy.setAttribute('aria-describedby', errorElement.id)
        errorElement.textContent = message
      },
      removeError: function (element) {
        var adapterWrapper = element.closest('.adapter-field')
        var adapterProxy = adapterWrapper.querySelector('[data-csv-adapter-proxy]')
        var errorElement = adapterWrapper.querySelector('.csv-adapter-error')

        adapterProxy.classList.remove('is-invalid')
        adapterProxy.removeAttribute('aria-invalid')
        adapterProxy.removeAttribute('aria-describedby')

        if (errorElement) {
          errorElement.remove()
        }
      }
    })

    dataCsv = {
      html_settings: {
        type: 'ActionView::Helpers::FormBuilder',
        input_tag: '<div class="field_with_errors"><span id="input_tag"></span><label for="user_role" class="message"></label></div>',
        label_tag: '<div class="field_with_errors"><label id="label_tag"></label></div>'
      },
      validators: {
        'user[role]': { presence: [{ message: 'must be present' }] }
      }
    }

    form.action = '/users'
    form.dataset.clientSideValidations = JSON.stringify(dataCsv)
    form.method = 'post'
    form.id = 'new_user'

    wrapper.className = 'adapter-field'

    label.htmlFor = 'user_role'
    label.textContent = 'Role'
    wrapper.appendChild(label)

    select.name = 'user[role]'
    select.id = 'user_role'
    select.hidden = true
    select.dataset.csvAdapter = 'fake-select'
    select.fakeWidget = createFakeWidget()

    blankOption.value = ''
    blankOption.textContent = 'Select one'
    select.appendChild(blankOption)

    validOption.value = 'admin'
    validOption.textContent = 'Admin'
    select.appendChild(validOption)

    wrapper.appendChild(select)

    proxy.type = 'text'
    proxy.readOnly = true
    proxy.setAttribute('data-csv-adapter-proxy', 'true')
    wrapper.appendChild(proxy)

    form.appendChild(wrapper)
    fixture.appendChild(form)

    ClientSideValidations.validate(form)
  },

  afterEach: function () {
    ClientSideValidations.adapters.items = []
    document.getElementById('qunit-fixture').replaceChildren()
  }
})

QUnit.test('Adapter-managed hidden inputs bind widget events and render on the proxy', function (assert) {
  var form = document.getElementById('new_user')
  var select = document.getElementById('user_role')
  var proxy = form.querySelector('[data-csv-adapter-proxy]')

  assert.ok(select.dataset.csvValidate)
  assert.equal(select.fakeWidget.handlerCount('change'), 1)

  select.fakeWidget.trigger('change')

  assert.ok(proxy.classList.contains('is-invalid'))
  assert.equal(form.querySelector('.csv-adapter-error').textContent, 'must be present')

  select.value = 'admin'
  select.fakeWidget.trigger('dropdown_close')

  assert.notOk(proxy.classList.contains('is-invalid'))
  assert.notOk(form.querySelector('.csv-adapter-error'))
})

QUnit.test('Adapter bindings are cleaned before re-enabling the form', function (assert) {
  var form = document.getElementById('new_user')
  var select = document.getElementById('user_role')

  ClientSideValidations.validate(form)

  assert.equal(select.fakeWidget.handlerCount('change'), 1)
  assert.equal(select.fakeWidget.handlerCount('blur'), 1)
  assert.equal(select.fakeWidget.handlerCount('dropdown_close'), 1)
})

QUnit.test('Adapters fall back to the default form builder when addError/removeError are omitted', function (assert) {
  var form = document.getElementById('new_user')
  var select = document.getElementById('user_role')

  ClientSideValidations.disable(form)
  ClientSideValidations.adapters.items = []

  ClientSideValidations.adapters.register({
    matches: function (element) {
      return element.matches('select[data-csv-adapter="fake-select"]')
    },
    bind: function (element, validate) {
      var events = ['change', 'blur', 'dropdown_close']

      events.forEach(function (eventName) {
        element.fakeWidget.on(eventName, validate)
      })

      return function () {
        events.forEach(function (eventName) {
          element.fakeWidget.off(eventName, validate)
        })
      }
    }
  })

  ClientSideValidations.validate(form)

  select.fakeWidget.trigger('change')

  assert.ok(select.closest('.field_with_errors'))
  assert.equal(form.querySelector('label.message[for="user_role"]').textContent, 'must be present')

  select.value = 'admin'
  select.fakeWidget.trigger('dropdown_close')

  assert.notOk(select.closest('.field_with_errors'))
  assert.notOk(form.querySelector('label.message[for="user_role"]'))
})

QUnit.test('Adapter-managed hidden inputs block form submission (async)', function (assert) {
  var done = assert.async()
  var form = document.getElementById('new_user')
  var proxy = form.querySelector('[data-csv-adapter-proxy]')

  form.requestSubmit()

  setTimeout(function () {
    var iframe = document.querySelector('iframe')
    var response = iframe && iframe.contentDocument && iframe.contentDocument.querySelector('#response')

    assert.notOk(response)
    assert.ok(proxy.classList.contains('is-invalid'))
    done()
  }, 250)
})
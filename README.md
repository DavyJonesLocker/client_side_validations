# ClientSideValidations #

[![Gem Version](https://badge.fury.io/rb/client_side_validations.svg)](https://badge.fury.io/rb/client_side_validations)
[![npm version](https://badge.fury.io/js/%40client-side-validations%2Fclient-side-validations.svg)](https://badge.fury.io/js/%40client-side-validations%2Fclient-side-validations)
[![Ruby Build Status](https://github.com/DavyJonesLocker/client_side_validations/actions/workflows/ruby.yml/badge.svg)](https://github.com/DavyJonesLocker/client_side_validations/actions)
[![JavaScript Build Status](https://github.com/DavyJonesLocker/client_side_validations/actions/workflows/javascript.yml/badge.svg)](https://github.com/DavyJonesLocker/client_side_validations/actions)
[![Maintainability](https://qlty.sh/gh/DavyJonesLocker/projects/client_side_validations/maintainability.svg)](https://qlty.sh/gh/DavyJonesLocker/projects/client_side_validations)
[![Coverage Status](https://coveralls.io/repos/github/DavyJonesLocker/client_side_validations/badge.svg?branch=main)](https://coveralls.io/github/DavyJonesLocker/client_side_validations?branch=main)


`ClientSideValidations` made easy for your Rails 7.2 and 8.x applications!

## Project Goals ##

1. Follow the best practices for client side validations developed by [Luke Wroblewski](https://alistapart.com/article/inline-validation-in-web-forms/)
2. Automatically extract and apply validation rules defined on the
   server to the client.
3. In the cases where a server-side validation rule would not work on
   the client (i.e. conditional callbacks like :if, :unless) then do not
   attempt client side validations. Fall back to the server side
   validation.
4. The client side validation error rendering should be
   indistinguishable from the server side validation error rendering.
5. Wide browser compliancy.
6. Work with any ActiveModel::Validations based model
7. Validate nested fields
8. Support custom validations
9. Client side validation callbacks
10. Plugin system to support additional FormBuilders, ORMs, etc...

## Install ##

Add the following line to your Gemfile:

```ruby
gem 'client_side_validations'
```

Then run `bundle install`

Please run `spring stop` if you are using [Spring](https://github.com/rails/spring)

Next you need to run the generator:

```
rails g client_side_validations:install
```

This will install the initializer:

```
config/initializers/client_side_validations.rb
```

### JavaScript file ###

Starting with 25.0, ClientSideValidations is a [Stimulus](https://stimulus.hotwired.dev) controller.
Rails already ships Stimulus via `@hotwired/stimulus-rails`, so no extra JavaScript dependency is
typically required.

Add the npm package:

```sh
yarn add @client-side-validations/client-side-validations
# or
bin/importmap pin @client-side-validations/client-side-validations
```

Then register the controller with your Stimulus `Application`. In a typical
`app/javascript/controllers/index.js`:

```js
import { application } from './application'
import { ClientSideValidationsController } from '@client-side-validations/client-side-validations'

application.register('client-side-validations', ClientSideValidationsController)
```

Or, using the bundled `register` helper (equivalent, with the default
identifier `client-side-validations`):

```js
import { application } from './application'
import { register } from '@client-side-validations/client-side-validations'

register(application)
// or, with a custom identifier
register(application, 'csv-form')
```

The install generator also copies a stub controller at
`app/javascript/controllers/client_side_validations_controller.js` that simply
re-exports the controller from the npm package, so you can adapt it if you
need to customize behaviour.

If you pick a custom identifier, mirror it on the Ruby side:

```ruby
# config/initializers/client_side_validations.rb
ClientSideValidations::Config.stimulus_controller_name = 'csv-form'
```

## Migration Guide ##

### 25.x Breaking Changes ###

Release 25.0 replaces the auto-booting runtime with a Stimulus controller.
Review the following migration steps when upgrading from 24.x:

* **Data attributes have changed.** Forms emit
  `data-controller="client-side-validations"` and
  `data-client-side-validations-settings-value='{...}'` instead of
  `data-client-side-validations='{...}'`. Validated inputs and confirmation
  fields get `data-client-side-validations-target="input"` or
  `data-client-side-validations-target="confirmation"`. The Rails form helpers
  emit these automatically when `validate: true` is set; you do not need to add
  them by hand.
* **The `ClientSideValidations.enable / validate / disable / reset` public API
  is gone.** The Stimulus lifecycle (`connect`, `disconnect`,
  `inputTargetConnected`, `inputTargetDisconnected`) handles binding and
  unbinding. Dynamically inserted inputs (e.g. cocoon, Turbo Stream appends,
  `stimulus-rails-nested-form`) are picked up automatically through Stimulus
  target callbacks, no `enable()` call required.
* **No automatic `window.ClientSideValidations` global.** Import what you
  need directly from the package. The remaining `ClientSideValidations`
  export is a configuration namespace (`validators`, `formBuilders`,
  `callbacks`, `patterns`). The validation helpers (`isValid`,
  `validateElement`, `validateForm`, `validatorsFor`) are exported
  separately.
* **UMD bundle and Sprockets support removed.** Only an ESM bundle is
  shipped. The `client_side_validations:copy_assets` generator is gone; use
  the npm package through Importmaps, Webpacker, esbuild, Vite, or your
  bundler of choice.
* **`ajax:beforeSend` / `remote: true` integration removed.** `form_with`
  no longer coordinates with `jquery-ujs`; validation runs on the native
  `submit` event. If you relied on this integration, migrate to Turbo or
  handle `submit` yourself.
* **`data-client-side-validations` attribute removed.** Read the settings
  via `data-client-side-validations-settings-value` (a JSON-encoded Stimulus
  value) or via `form.ClientSideValidations.settings` after the controller
  connects.

### 24.x Breaking Changes ###

If you are upgrading across both 24.x and 25.x, keep the following 24.x
changes in mind as well:

* The old jQuery plugin methods were removed in favor of native DOM
  APIs. 25.0 then replaced 24.x's imperative lifecycle helpers with the
  Stimulus controller described above, so do not carry forward any
  `enable`, `validate`, `disable`, or `reset` calls from older examples.
* Custom validators, form builders, and callbacks now receive native DOM
  nodes instead of jQuery wrappers. Update any custom code to use DOM
  APIs such as `.value`, `.form`, `.closest()`, and `querySelector()`.
* Local validators are called as `(element, options)`. Form callbacks
  receive `(form, eventData)`, and element callbacks receive either
  `(element, message, callback, eventData)` or
  `(element, callback, eventData)` depending on the event.

All runtime-owned validation state attributes are namespaced under
`csv`. If you read or write these attributes in custom code, update them
to the scoped names:

```text
data-changed => data-csv-changed
data-valid => data-csv-valid
data-validate => data-csv-validate
data-not-locally-unique => data-csv-not-locally-unique
```

The matching dataset properties are `element.dataset.csvChanged`,
`element.dataset.csvValid`, `element.dataset.csvValidate`, and
`element.dataset.csvNotLocallyUnique`. `csvChanged` is stored as the
string values `'true'` and `'false'`.

**jQuery namespaced events are removed.** Events are now plain native
DOM custom events. If your application listens to or unbinds events
using jQuery-style namespacing, update those calls.

Before:

```js
$(form).on('form:validate:before.ClientSideValidations', handler)
$(input).off('.ClientSideValidations')
```

After:

```js
form.addEventListener('form:validate:before', handler)
// store and pass the handler reference to removeEventListener when unbinding
```

The full list of native events dispatched by ClientSideValidations is:
`form:validate:before`, `form:validate:after`, `form:validate:pass`,
`form:validate:fail`, `element:validate:before`,
`element:validate:after`, `element:validate:pass`,
`element:validate:fail`.

If you are upgrading from a version older than 23.0.0, the
`data-csv-*` renaming above is required for any custom code that still
reads or writes the old attribute names. If you are already on 23.x,
the new 24.x upgrade step is to update any local uniqueness
integrations that still reference `data-not-locally-unique` or
`element.dataset.notLocallyUnique`.

If you previously vendored the compiled asset with
`rails g client_side_validations:copy_assets`, remove that integration
when upgrading to 25.x; the generator no longer exists.

## Initializer ##

The initializer includes a commented out `ActionView::Base.field_error_proc`.
Uncomment this to render your error messages inline with the input fields.

I recommend you to not use a solution similar to `error_messages_for`. Client
Side Validations does not support this type of error rendering. If you want to
maintain consistency between the client side rendered validation error messages
and the server side rendered validation error messages please use what is in
`config/initializers/client_side_validations.rb`

## Plugins ##

There is additional support for other `ActiveModel` based ORMs and other
Rails `FormBuilders`. Please see the [Plugin wiki page](https://github.com/DavyJonesLocker/client_side_validations/wiki/Plugins)
(feel free to add your own)

* [SimpleForm](https://github.com/DavyJonesLocker/client_side_validations-simple_form)
* [Mongoid](https://github.com/DavyJonesLocker/client_side_validations-mongoid)

## Usage ##

In your `FormBuilder` you only need to enable validations:

```erb
<%= form_for @user, validate: true do |f| %>
  ...
```

That should be enough to get you going.

Starting from version 14.0, ClientSideValidations also supports `form_with`.
The syntax is the same as `form_for`:

```erb
<%= form_with model: @user, validate: true do |f| %>
  ...
```

**Note:** ClientSideValidations requires `id` attributes on form fields to
work, so it will force `form_with` to generate ids.

## Validators order ##

By default, ClientSideValidations will perform the validations in the same order
specified in your models. In other words, if you want to validate the format
of an email field before its presence, you can use the following:

```rb
class User < ApplicationRecord
  validates :email, format: { with: /\A[^@\s]+@[^@\s]+\z/ }, presence: true
end
```

## Conditional Validators ##

By default conditional validators are not evaluated and passed to the client.
We do this because the state model when the form is rendered is not necessarily the state
of the model when the validations fire server-side. However, if you wish to override this behavior you can do so
in the form. Given the following model:

```ruby
class Person < ActiveRecord::Base
  validates :name, presence: true, length: { maximum: 10 }, if: :can_validate?

  def can_validate?
    true
  end
end
```

You can force in the form:

```erb
<%= f.text_field :name, validate: true %>
```

Passing `validate: true` will force all the validators for that attribute. If there are conditionals
they are evaluated with the state of the model when rendering the form. You can also force
individual validators:

```erb
<%= f.text_field :name, validate: { presence: true } %>
```

In the above case only the `presence` validator will be passed to the client.

This is also the case with [other supported conditional validations](https://guides.rubyonrails.org/v5.2.3/active_record_validations.html#conditional-validation) (such as Procs, Arrays or Strings).

**NOTE:** when `:if` conditional includes a symbol or a string with
`changed?` in it or start with `will_save_change_to`, validator will forced automatically.

```ruby
class Person < ActiveRecord::Base
  validates :name, presence: true, if: :name_changed?
end
```

The presence of name in the example above will be validated
without explicit forcing.

This is done because it is always assumed the value will change on the
form.

Conditionals defined with `:unless` key do not have this optimization.

### Turning off validators ###

If you wish to skip validations on a given attribute force it to `false`:

```erb
<%= f.text_field :name, validate: false %>
```

If you want to be more selective about the validation that is turned off you can simply do:

```erb
<%= f.text_field :name, validate: { presence: false } %>
```

You can even turn them off per fieldset:

```erb
<%= f.fields_for :profile, validate: false do |p| %>
  ...
```

Please note that `pass` callback will also be performed on fields that skip validations.

## Understanding the Stimulus settings value ##

A rendered form with validations will always have:

* `data-controller="client-side-validations"`
* `data-client-side-validations-settings-value='...'`

After Stimulus connects, the same data is available at
`form.ClientSideValidations.settings`.

The settings object contains different keys depending on the
`FormBuilder` being used. However, `html_settings` and `validators` will
always be present.

### `html_settings` ###

This will always contain the type to the class of the `FormBuilder` that did the rendering. The type will be used by the JavaScript to determine how to `add` and `remove` the error messages. If you create a new `FormBuilder`, you will need to write your own handlers for adding and removing.

### `validators` ###

This object contains the validators for each of the inputs rendered on the `FormBuilder`. Each input is keyed to the `name` attribute and each containing validator could simply contain the error message itself or also specific options on how that validator should be run.

### Adding validators that aren't inputs ###

If you need to add more validators but don't want them rendered on the form immediately you can inject those validators with `FormBuilder#validate`:

```erb
<%= form_for @user, validate: true do |f| %>
  <p>
    <%= f.label :name %>
    <%= f.text_field :name %>
  </p>
  <%= f.validate :age, :bio %>
...
```

In the above example `age` and `bio` will not render as inputs on the
form, but their validators will still be added to the `validators`
object for later use. If you do dynamically render these inputs later,
their `name` attributes must match the keys on the `validators` object.
If the fields are rendered by ClientSideValidations-aware Rails helpers,
the correct Stimulus target attributes are added automatically. If you
add markup by hand, keep the fields inside the same validated form and
add `data-client-side-validations-target="input"` yourself (or use the
`confirmation` target plus
`data-client-side-validations-confirms="field_id"` for confirmation
inputs).

You can add all attributes with validators for the given object by
passing nothing:

```erb
<%= f.validate %>
```

You can also force validators similarly to the input syntax:

```erb
<%= f.validate :email, presence: false %>
```

Take care when using this method. The embedded validators are
overwritten based upon the order they are rendered. So if you do
something like:

```erb
<%= f.text_field :email, validate: { presence: false } %>
<%= f.validate %>
```

The `presence` validator will not be turned off because the options
were overwritten by the call to `FormBuilder#validate`


## Customize Error Rendering ##

`ClientSideValidations` uses `ActionView::Base.field_error_proc` (or the
current form builder's equivalent settings) to decide how error markup
should look on the server. If you change that markup in
`config/initializers/client_side_validations.rb`, mirror the same shape
in the client-side form builder functions.

A simple way to do that is to create
`app/javascript/client_side_validations.js` and import it once from your
JavaScript entrypoint (`app/javascript/application.js`,
`application.ts`, etc.):

```js
import ClientSideValidations from '@client-side-validations/client-side-validations'

ClientSideValidations.formBuilders['ActionView::Helpers::FormBuilder'] = {
  add (element, settings, message) {
    // custom add code here
  },

  remove (element, settings) {
    // custom remove code here
  }
}
```

If you prefer, you can place the same code in the generated
`app/javascript/controllers/client_side_validations_controller.js`
before exporting the controller. Either way, make sure the
customization runs once before the form is validated for the first
time.

## Custom Validators ##

### Local Validators ###
Client Side Validations supports the use of custom validators. The following is an example for creating a custom validator that validates the format of email addresses.

Let's say you have several models that all have email fields and you are validating the format of that email address on each one. This is a common validation and could probably benefit from a custom validator. We're going to put the validator into `config/initializers/email_validator.rb`

```ruby
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attr_name, value)
    unless value =~ /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
      record.errors.add(attr_name, :email, options.merge(value: value))
    end
  end
end

# This allows us to assign the validator in the model
module ActiveModel::Validations::HelperMethods
  def validates_email(*attr_names)
    validates_with EmailValidator, _merge_attributes(attr_names)
  end
end
```

Heads-up!: Put custom initializers in `config/initializers`, otherwise named validator helpers will not
be available and migrations will not work.

Next we need to add the error message to the Rails i18n file `config/locales/en.yml`

```yaml
# config/locales/en.yml
en:
  errors:
    messages:
      email: "Not an email address"
```

Finally we need to add a client side validator. Register it in the same
`app/javascript/client_side_validations.js` file (or any module that is
imported once during boot):

```js
import ClientSideValidations from '@client-side-validations/client-side-validations'

ClientSideValidations.validators.local.email = (element, options) => {
  if (!/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i.test(element.value)) {
    return options.message
  }
}
```

That's it! Now you can use the custom validator as you would any other validator in your model

```ruby
# app/models/person.rb
class Person < ActiveRecord::Base
  validates_email :email
end
```

Client Side Validations will apply the new validator and validate your forms as needed.

## Dynamic forms and inputs ##

Stimulus now owns binding and unbinding, so there is no separate
`enable`, `disable`, or `reset` API in 25.x.

* If you insert a new form generated with `validate: true`, Stimulus
  connects automatically when the form enters the DOM.
* If you append new fields generated by the Rails helpers inside an
  existing validated form, the helper-generated target attributes let
  Stimulus bind them automatically.
* If you append markup by hand, keep it inside the same form and add
  `data-client-side-validations-target="input"` (or `confirmation`
  with `data-client-side-validations-confirms="field_id"`) yourself.
* To stop validation for a dynamic field, remove the element or remove
  the target attribute and let Stimulus disconnect it.

## Callbacks ##

`ClientSideValidations` will run callbacks based upon the state of the element or form. The following callbacks are supported:

* `ClientSideValidations.callbacks.element.after(element, eventData)`
* `ClientSideValidations.callbacks.element.before(element, eventData)`
* `ClientSideValidations.callbacks.element.fail(element, message, callback, eventData)`
* `ClientSideValidations.callbacks.element.pass(element, callback, eventData)`
* `ClientSideValidations.callbacks.form.after(form, eventData)`
* `ClientSideValidations.callbacks.form.before(form, eventData)`
* `ClientSideValidations.callbacks.form.fail(form, eventData)`
* `ClientSideValidations.callbacks.form.pass(form, eventData)`

The names of the callbacks are literal: for example,
`ClientSideValidations.callbacks.form.fail` runs when a form fails
validation, and `ClientSideValidations.callbacks.element.before` runs
before a particular element is validated.

The `eventData` argument is the native `CustomEvent` dispatched by the
runtime. `ClientSideValidations.callbacks.element.fail()` receives the
failed message as the second parameter, the callback for adding error
fields as the third parameter, and the eventData object as the fourth
parameter. `ClientSideValidations.callbacks.element.pass()` receives
the callback for removing the error fields as the second parameter.
If you override either callback, you must still invoke `addError()` or
`removeError()` yourself.

A simple setup is to create `app/javascript/client_side_validations.js`
and import it once from your JavaScript entrypoint:

```js
import ClientSideValidations from '@client-side-validations/client-side-validations'

ClientSideValidations.callbacks.element.fail = (element, message, addError, event) => {
  addError()

  const messageElement = element.parentElement.querySelector('.message')

  if (messageElement && typeof messageElement.animate === 'function') {
    messageElement.animate(
      [
        { opacity: 0, transform: 'translateX(-8px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      { duration: 250, easing: 'ease-out', fill: 'both' }
    )
  }
}

ClientSideValidations.callbacks.element.pass = (element, removeError, event) => {
  removeError()
}
```

If you prefer to keep all ClientSideValidations-specific wiring in one
place, the generated
`app/javascript/controllers/client_side_validations_controller.js` stub
is also a good home for these assignments.

``` css
.message {
  background-color: red;
  border-bottom-right-radius: 5px 5px;
  border-top-right-radius: 5px 5px;
  display: inline-block;
  padding: 2px 5px;
}
```

Finally uncomment the `ActionView::Base.field_error_proc` override in `config/initializers/client_side_validations.rb`

## Disable validators ##

If you want to disable some validators, set the `disabled_validators` config variable in `config/initializers/client_side_validations.rb`:

```ruby
# Example: disable the presence validator
ClientSideValidations::Config.disabled_validators = [:presence]
```

Note that the `FormBuilder` will automatically skip building validators that are disabled.

## Manual validation ##

By default, ClientSideValidations will automatically validate the form.

If for some reason you would like to manually validate the form (for example you're working with a multi-step form), you can use the following approach:

```js
import { isValid } from '@client-side-validations/client-side-validations'

const input = document.getElementById('myInputField')
const form = input.form

// Wait until Stimulus has connected the form, then validate.
isValid(input)
isValid(form)

// Or pass validators explicitly if you need them.
const validators = form.ClientSideValidations.settings.validators
isValid(input, validators)
isValid(form, validators)
```

To manually validate a single field, you may also trigger a focusout event:

```js
input.dispatchEvent(new Event('focusout', { bubbles: true }))
```

## Authors ##

[Brian Cardarella](https://twitter.com/bcardarella)

[Geremia Taglialatela](https://twitter.com/gtagliala)

[We are very thankful for the many contributors](https://github.com/DavyJonesLocker/client_side_validations/graphs/contributors)

## Versioning ##

This gem follows [Semantic Versioning](https://semver.org)

## Want to help? ##

Please do! We are always looking to improve this gem. Please see our
[Contribution Guidelines](https://github.com/DavyJonesLocker/client_side_validations/blob/main/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal ##

[DockYard](https://dockyard.com/), LLC &copy; 2012-2024

[@dockyard](https://twitter.com/dockyard)

[Licensed under the MIT license](https://opensource.org/licenses/mit)

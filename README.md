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

Instructions depend on your technology stack.

ClientSideValidations no longer depends on jQuery.
If you previously installed `jquery-rails`, `jquery_ujs`, or custom jQuery startup code only for ClientSideValidations, you can remove that integration when upgrading to 24.x.

####  When using Webpacker ####

Add the following package:

```sh
yarn add @client-side-validations/client-side-validations
```

Then add the following line to your `app/javascript/packs/application.js` pack:

```js
// If you are using `import` syntax
import '@client-side-validations/client-side-validations'

// If you are using `require` syntax
require('@client-side-validations/client-side-validations')
```

##### Heads-up for Turbo and Turbolinks users #####

If you are using [Turbo](https://github.com/hotwired/turbo-rails), use the
`import` syntax and make sure that `@client-side-validations/client-side-validations`
is imported **after** `@hotwired/turbo-rails`, so ClientSideValidations can properly detect
`window.Turbo` and attach its event handlers.

If you are using [Turbolinks](https://github.com/turbolinks/turbolinks) 5.2,
use the `require` syntax and make sure that `@client-side-validations/client-side-validations`
is required **after** `Turbolinks.start()`, so ClientSideValidations can properly
detect `window.Turbolinks` and attach its event handlers.

####  When using Sprockets ####

Add the following to your `app/assets/javascripts/application.js` file:

```js
//= require rails.validations
```

If you are using [Turbolinks](https://github.com/turbolinks/turbolinks),
make sure that `rails.validations` is required **after** `turbolinks`, so
ClientSideValidations can properly attach its event handlers.

If you need to copy the asset files from the gem into your project, run:

```
rails g client_side_validations:copy_assets
```

Note: If you run `copy_assets`, you will need to run it again each time you update this project.

## Migration Guide ##

### 24.x Breaking Changes ###

If you are upgrading to 24.x, update your integration code to use the `ClientSideValidations` object directly.

The old jQuery plugin methods are removed. Use the DOM-first public API instead:

```js
ClientSideValidations.enable(form)
ClientSideValidations.validate(form)
ClientSideValidations.isValid(form, validators)
ClientSideValidations.disable(form)
ClientSideValidations.reset(form)
```

These methods accept native DOM elements and DOM collections. They do not accept jQuery objects or CSS selector strings.

Custom validators, form builders, and callbacks now receive native DOM nodes instead of jQuery wrappers. Update any custom code to use DOM APIs such as `.value`, `.form`, `.closest()`, and `querySelector()`.
Local validators are called as `(element, options)`. Form callbacks receive `(form, eventData)`, and element callbacks receive either `(element, message, callback)` or `(element, callback)` depending on the event.

All runtime-owned validation state attributes are now namespaced under `csv`. If you read or write these attributes in custom selectors, callbacks, or validators, update them to the scoped names:

```text
data-changed => data-csv-changed
data-valid => data-csv-valid
data-validate => data-csv-validate
data-not-locally-unique => data-csv-not-locally-unique
```

The matching dataset properties are `element.dataset.csvChanged`, `element.dataset.csvValid`, `element.dataset.csvValidate`, and `element.dataset.csvNotLocallyUnique`. `csvChanged` is stored as the string values `'true'` and `'false'`.

**jQuery namespaced events are removed.** Events are now plain native DOM custom events. If your application listens to or unbinds events using jQuery-style namespacing, you must update those calls.

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

The full list of native events dispatched by ClientSideValidations: `form:validate:before`, `form:validate:after`, `form:validate:pass`, `form:validate:fail`, `element:validate:before`, `element:validate:after`, `element:validate:pass`, `element:validate:fail`.

If you are upgrading from a version older than 23.0.0, the `data-csv-*` renaming above is required for any custom code that still reads or writes the old attribute names. If you are already on 23.x, the new 24.x upgrade step is to update any local uniqueness integrations that still reference `data-not-locally-unique` or `element.dataset.notLocallyUnique`.

If your application vendors the compiled asset with `rails g client_side_validations:copy_assets`, run that generator again after upgrading so your copied asset matches the current jQuery-free bundle.

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

## Understanding the client side validations data attribute ##

A rendered form with validations will always have a `data-client-side-validations` attribute.

The objects it contains will have different keys depending upon the `FormBuilder` being used. However, `html_settings` and `validators` will always be present.

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

In the above example `age` and `bio` will not render as inputs on the form but their validators will be properly added to the `validators` object for use later. If you do intend to dynamically render these inputs later the `name` attributes on the inputs will have to match with the keys on the `validators` object, and the inputs will have to be enabled for client side validation.

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

`ClientSideValidations` will use `ActiveRecord::Base.field_error_proc` to render the error messages. Other `FormBuilders` will use their own settings.

If you need to change the markup of how the errors are rendered you can modify that in `config/initializers/client_side_validations.rb`

*Please Note* if you modify the markup, you will also need to modify `ClientSideValidations.formBuilders['ActionView::Helpers::FormBuilder']`'s `add` and `remove` functions. You can override the behavior by creating a new JavaScript file called `rails.validations.actionView.js` that contains the following:

```js
window.ClientSideValidations.formBuilders['ActionView::Helpers::FormBuilder'] = {
  add: function(element, settings, message) {
    // custom add code here
  },

  remove: function(element, settings) {
    // custom remove code here
  }
}
```

Please view the code in `rails.validations.js` to see how the existing `add` and `remove` functions work and how best to override for your specific use-case.

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

Finally we need to add a client side validator. This can be done by hooking into the `ClientSideValidations.validator` object. Create a new file `app/assets/javascripts/rails.validations.customValidators.js`

```js
// The options variable is a JSON Object
// The element variable is a DOM element
window.ClientSideValidations.validators.local.email = function (element, options) {
  // Your validator code goes in here
  if (!/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i.test(element.value)) {
    // When the value fails to pass validation you need to return the error message.
    // It can be derived from validator.message
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

## Enabling, Disabling, and Resetting on the client ##

There are many reasons why you might want to enable, disable, or even completely reset the bound validation events on the client. `ClientSideValidations` offers a simple API for this.

### Enabling ###

If you have rendered a new form via AJAX into your page you will need to enable that form for validation:

```js
ClientSideValidations.enable(newForm)
```

You should attach this to an event that is fired when the new HTML renders.

You can use the same function if you introduce new inputs to an existing form:

```js
ClientSideValidations.enable(newInput)
```

### Disabling ###

If you wish to turn off validations entirely on a form:

```js
ClientSideValidations.disable(form)
```

### Resetting ###

You can reset the current state of the validations, clear all error messages, and reattach clean event handlers:

```js
ClientSideValidations.reset(form)
```

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

The names of the callbacks should be pretty straight forward. For example, `ClientSideValidations.callbacks.form.fail` will be called if a form failed to validate. And `ClientSideValidations.callbacks.element.before` will be called before that particular element's validations are run.

All element callbacks receive the DOM element as the first parameter and the native event object as the second parameter. `ClientSideValidations.callbacks.element.fail()` receives the failed message as the second parameter, the callback for adding error fields as the third parameter, and the eventData object as the fourth parameter. `ClientSideValidations.callbacks.element.pass()` receives the callback for removing the error fields as the second parameter. The error field callbacks must still be invoked by your custom callback.

All form callbacks receive the DOM form element as the first parameter and the native event object as the second parameter.

Here is an example callback that animates the error message when validation fails:

``` javascript
window.ClientSideValidations.callbacks.element.fail = function (element, message, callback) {
  callback()

  var messageElement = element.parentElement.querySelector('.message')

  if (messageElement) {
    if (typeof messageElement.animate === 'function') {
      messageElement.animate(
        [
          { opacity: 0, transform: 'translateX(-8px)' },
          { opacity: 1, transform: 'translateX(0)' }
        ],
        { duration: 250, easing: 'ease-out', fill: 'both' }
      )
    } else {
      messageElement.style.opacity = '1'
      messageElement.style.transform = 'translateX(0)'
    }
  }
}

window.ClientSideValidations.callbacks.element.pass = function (element, callback) {
  callback()
}
```

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
const input = document.getElementById('myInputField')
const form = input.form
const validators = form.ClientSideValidations.settings.validators

// Validate a single field
ClientSideValidations.isValid(input, validators)

// Validate the whole form
ClientSideValidations.isValid(form, validators)
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

# ClientSideValidations #

[![Gem Version](https://badge.fury.io/rb/client_side_validations.svg)](http://badge.fury.io/rb/client_side_validations)
[![Build Status](https://secure.travis-ci.org/DavyJonesLocker/client_side_validations.svg?branch=master)](https://travis-ci.org/DavyJonesLocker/client_side_validations)
[![Dependency Status](https://gemnasium.com/DavyJonesLocker/client_side_validations.svg)](https://gemnasium.com/DavyJonesLocker/client_side_validations)
[![Code Climate](https://codeclimate.com/github/DavyJonesLocker/client_side_validations/badges/gpa.svg)](https://codeclimate.com/github/DavyJonesLocker/client_side_validations)
[![Coverage Status](https://coveralls.io/repos/github/DavyJonesLocker/client_side_validations/badge.svg?branch=master)](https://coveralls.io/github/DavyJonesLocker/client_side_validations?branch=master)

`ClientSideValidations` made easy for your Rails 4 applications!

## Project Goals ##

1. Follow the best practices for client side validations developed by [Luke Wroblewski](http://www.alistapart.com/articles/inline-validation-in-web-forms/)
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

Include `ClientSideValidations` in your Gemfile

```ruby
gem 'client_side_validations'
```

Then run the install generator

```
rails g client_side_validations:install
```

This will install the initializer:

```
config/initializers/client_side_validations.rb
```

If you want to copy the asset files from the gem into your project:

```
rails g client_side_validations:copy_assets
```

## Initializer ##

The initializer includes a commented out `ActionView::Base.field_error_proc`.
Uncomment this to render your error messages inline with the input fields.

I recommend you not use a solution similar to `error_messages_for`. Client
Side Validations is never going to support rendering this type of error
rendering. If you want to maintain consistency between the client side
rendered validation error messages and the server side rendered
validation error messages please use what is in
`config/initializers/client_side_validations.rb`

## Plugins ##

There is additional support for other `ActiveModel` based ORMs and other
Rails `FormBuilders`. Please see the [Plugin wiki page](https://github.com/DavyJonesLocker/client_side_validations/wiki/Plugins)
(feel free to add your own)

* [SimpleForm](https://github.com/DavyJonesLocker/client_side_validations-simple_form)
* [Formtastic](https://github.com/DavyJonesLocker/client_side_validations-formtastic)
* [Mongoid](https://github.com/DavyJonesLocker/client_side_validations-mongoid)
* [MongoMapper](https://github.com/DavyJonesLocker/client_side_validations-mongo_mapper)

## Usage ##

The javascript file is served up in the asset pipeline. Add the
following to your `app/assets/javascripts/application.js` file.

```js
//= require rails.validations
```

In your `FormBuilder` you only need to enable validations:

```erb
<%= form_for @user, validate: true do |f| %>
  ...
```

That should be enough to get you going.

By default the validators will be serialized and embedded in a
`<script>` tag following the `<form>` tag. If you would like to render
that `<script>` tag elsewhere you can do this by passing a name to
`:validate`

```erb
<%= form_for @user, validate: :user_validators do |f| %>
```

The `<script`> tag is added to `content_for()` with the name you passed,
so you can simply render that anywhere you like:

```erb
<%= yield(:user_validators) %>
```

## Conditional Validators ##

By default conditional validators are not evaluated and passed to the client.
We do this because the state model when the form is rendered is not necessarily the state
of the model when the validations fire server-side. However, if you wish to override this behavior you can do so
in the form. Given the following model:

```ruby
class Person < ActiveRecord::Base
  validates :name, :email, presence: true, length: { maximum: 10 }, if: :can_validate?

  def can_validate
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

This is also the case with Procs, or any object that responds to `#call`

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

## Wrapper objects and remote validations ##

For example, we have a wrapper class for the User model, UserForm, and it uses remote uniqueness validation for the `email` field.

```ruby
class UserForm
  include ActiveRecord::Validations
  attr_accessor :email
  validates_uniqueness_of :email
end
...
<% form_for(UserForm.new) do %>
...
```

However, this won't work since middleware will try to perform validation against UserForm, and it's not persisted.

This is solved by passing `client_validations` options hash to the validator, that currently supports one key — `:class`, and setting correct name to the form object:

```ruby
class UserForm
  include ActiveRecord::Validations
  attr_accessor :email
  validates_uniqueness_of :email, client_validations: { class:
  'User' }
end
...
<% form_for(UserForm.new, as: :user) do %>
...
```

## Understanding the embedded `<script>` tag ##

A rendered form with validations will always have a `<script>` appended
directly after:

```html
<script>//<![CDATA[if(window.ClientSideValidations==undefined)window.ClientSideValidations={};if(window.ClientSideValidations.forms==undefined)window.ClientSideValidations.forms={};window.ClientSideValidations.forms['new_person'] = {"type":"ActionView::Helpers::FormBuilder","input_tag":"<div class=\"field_with_errors\"><span id=\"input_tag\" /><label for=\"\" class=\"message\"></label></div>","label_tag":"<div class=\"field_with_errors\"><label id=\"label_tag\" /></div>","validators":{"person[name]":{"inclusion":[{"message":"is not included in the list","in":["Happy"]}]}}};//]]></script>
```

This script registers a new form object on `ClientSideValidations.form`. The key is equal to the ID of the form that is rendered. The objects it contains will have different keys depending upon the `FormBuilder` being used. However, `type` and `validators` will always be present.

### `type` ###

This will always be equal to the class of the `FormBuilder` that did the rendering. The type will be used by the JavaScript to determine how to `add` and `remove` the error messages. If you create a new `FormBuilder` you will need to write your own handlers for adding and removing.

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
<%= f.validate :email, uniqueness: false %>
```

Take care when using this method. The embedded validators are
overwritten based upon the order they are rendered. So if you do
something like:

```erb
<%= f.text_field :email, validate: { uniqueness: false } %>
<%= f.validate %>
```

The `uniqueness` validator will not be turned off because the options
were overwritten by the call to `FormBuilder#validate`


## Customize Error Rendering ##

`ClientSideValidations` will use `ActiveRecord::Base.field_error_proc` to render the error messages. Other `FormBuilders` will use their own settings.

If you need to change the markup of how the errors are rendered you can modify that in `config/initializers/client_side_validations.rb`

*Please Note* if you modify the markup, you will also need to modify `ClientSideValidations.formBuilders['ActionView::Helpers::FormBuilder']`'s `add` and `remove` functions. You can override the behavior by creating a new javascript file called `rails.validations.actionView.js` that contains the following:

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

Let's say you have several models that all have email fields and you are validating the format of that email address on each one. This is a common validation and could probably benefit from a custom validator. We're going to put the validator into `app/validators/email_validator.rb`

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
// The validator variable is a JSON Object
// The selector variable is a jQuery Object
window.ClientSideValidations.validators.local['email'] = function(element, options) {
  // Your validator code goes in here
  if (!/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i.test(element.val())) {
    // When the value fails to pass validation you need to return the error message.
    // It can be derived from validator.message
    return options.message;
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

### Remote Validators ###
A good example of a remote validator would be for Zipcodes. It wouldn't be reasonable to embed every single zipcode inline, so we'll need to check for its existence with remote javascript call back to our app. Assume we have a zipcode database mapped to the model Zipcode. The primary key is the unique zipcode. Our Rails validator would probably look something like this:

```ruby
class ZipcodeValidator < ActiveModel::EachValidator
  def validate_each(record, attr_name, value)
    unless ::Zipcode.where(id: value).exists?
      record.errors.add(attr_name, :zipcode, options.merge(value: value))
    end
  end
end

# This allows us to assign the validator in the model
module ActiveModel::Validations::HelperMethods
  def validates_zipcode(*attr_names)
    validates_with ZipcodeValidator, _merge_attributes(attr_names)
  end
end
```

Of course we still need to add the i18n message:

```yaml
en:
  errors:
    messages:
      zipcode: "Not a valid US zip code"
```

And let's add the Javascript validator. Because this will be remote validator we need to add it to `ClientSideValidations.validators.remote`:

```js
window.ClientSideValidations.validators.remote['zipcode'] = function(element, options) {
  if ($.ajax({
    url: '/validators/zipcode',
    data: { id: element.val() },
    // async *must* be false
    async: false
  }).status == 404) { return options.message; }
}
```

All we're doing here is checking to see if the resource exists (in this case the given zipcode) and if it doesn't the error message is returned.

Notice that the remote call is forced to *async: false*. This is necessary and the validator may not work properly if this is left out.

Now the extra step for adding a remote validator is to add to the middleware. All ClientSideValidations middleware should inherit from `ClientSideValidations::Middleware::Base`:

```ruby
module ClientSideValidations::Middleware
  class Zipcode < ClientSideValidations::Middleware::Base
    def response
      if ::Zipcode.where(id: request.params[:id]).exists?
        self.status = 200
      else
        self.status = 404
      end
      super
    end
  end
end
```

The `#response` method is always called and it should set the status accessor. Then a call to `super` is required. In the javascript we set the 'id' in the params to the value of the zipcode input, in the middleware we check to see if this zipcode exists in our zipcode database. If it does, we return 200, if it doesn't we return 404.

## Enabling, Disabling, and Resetting on the client ##

There are many reasons why you might want to enable, disable, or even completely reset the bound validation events on the client. `ClientSideValidations` offers a simple API for this.

### Enabling ###

If you have rendered a new form via AJAX into your page you will need to enable that form for validation:

```js
$(new_form).enableClientSideValidations();
```

You should attach this to an event that is fired when the new HTML renders.

You can use the same function if you introduce new inputs to an existing form:

```js
$(new_input).enableClientSideValidations();
```

### Disabling ###

If you wish to turn off validations entirely on a form:

```js
$(form).disableClientSideValidations();
```

### Resetting ###

You can reset the current state of the validations, clear all error messages, and reattach clean event handlers:

```js
$(form).resetClientSideValidations();
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

All element callbacks will receive the element in a jQuery object as the first parameter and the eventData object as the second parameter. `ClientSideValidations.callbacks.element.fail()` will receive the message of the failed validation as the second parameter, the callback for adding the error fields as the third and the eventData object as the third. `ClientSideValidations.elementValidatePass()` will receive the callback for removing the error fields. The error field callbacks must be run in your custom callback in some fashion. (either after a blocking event or as a callback for another event, such as an animation)

All form callbacks will receive the form in a jQuery object as the first parameter and the eventData object as the second parameter.

Here is an example callback for sliding out the error message when the validation fails then sliding it back in when the validation passes:

``` javascript
// You will need to require 'jquery-ui' for this to work
window.ClientSideValidations.callbacks.element.fail = function(element, message, callback) {
  callback();
  if (element.data('valid') !== false) {
    element.parent().find('.message').hide().show('slide', {direction: "left", easing: "easeOutBounce"}, 500);
  }
}

window.ClientSideValidations.callbacks.element.pass = function(element, callback) {
  // Take note how we're passing the callback to the hide()
  // method so it is run after the animation is complete.
  element.parent().find('.message').hide('slide', {direction: "left"}, 500, callback);
}
```

``` css
.message {
  background-color: red;
  border-bottom-right-radius: 5px 5px;
  border-top-right-radius: 5px 5px;
  padding: 2px 5px;
}

div.field_with_errors div.ui-effects-wrapper {
  display: inline-block !important;
}
```

Finally uncomment the `ActionView::Base.field_error_proc` override in `config/initializers/client_side_validations.rb`

## Security ##

Client Side Validations comes with a uniqueness middleware. This can be a potential security issue, so the uniqueness validator is disabled by default. If you want to enable it, set the `disabled_validators` config variable in `config/initializers/client_side_validations.rb`:

```ruby
ClientSideValidations::Config.disabled_validators = []
```

Note that the `FormBuilder` will automatically skip building validators that are disabled.

## Authors ##

[Brian Cardarella](https://twitter.com/bcardarella)

[Geremia Taglialatela](https://twitter.com/gtagliala)

[We are very thankful for the many contributors](https://github.com/DavyJonesLocker/client_side_validations/graphs/contributors)

## Versioning ##

This gem follows [Semantic Versioning](http://semver.org)

Major and minor version numbers will follow `Rails`'s major and
minor version numbers. For example,
`client_side_validations-4.2.0` will be compatible up to
`~> rails-4.2.0`

We will maintain compatibility with one minor version back. So the 4.2.0 version of `client_side_validations`
will be compatible with `~> rails-4.1.0`. We will not drop support
to older versions if not necessary.

Only two versions minor versions will be actively maintained.

## Want to help? ##

Please do! We are always looking to improve this gem. Please see our
[Contribution Guidelines](https://github.com/DavyJonesLocker/client_side_validations/blob/master/CONTRIBUTING.md)
on how to properly submit issues and pull requests.

## Legal ##

[DockYard](https://dockyard.com/), LLC &copy; 2012-2016

[@dockyard](https://twitter.com/dockyard)

[Licensed under the MIT license](https://opensource.org/licenses/mit-license.php)

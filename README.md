# ClientSideValidations #

[![Build Status](https://secure.travis-ci.org/bcardarella/client_side_validations.png?branch=3-2-stable)](http://travis-ci.org/bcardarella/client_side_validations)
[![Dependency Status](https://gemnasium.com/bcardarella/client_side_validations.png?travis)](https://gemnasium.com/bcardarella/client_side_validations)
[![Code Climate](https://codeclimate.com/badge.png)](https://codeclimate.com/github/bcardarella/client_side_validations)

`ClientSideValidations` made easy for your Rails v3.1+ applications!

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

If you are using Rails 3.1+ you'll need to use:

```
rails g client_side_validations:copy_assets
```

## Initializer ##

The initializer includes a commented out `ActionView::Base.field_error_proc`.
Uncomment this to render your error messages inline with the input fields.

I recommend you not use a solution similar to `error_messages_for`. Client
Side Validations is never going to support rendering these type of error
messages. If you want to maintain consistency between the client side
rendered validation error messages and the server side rendered
validation error messages please use what is in
`config/initializers/client_side_validations.rb`

## Usage ##

The javascript file is served up in the asset pipeline. Add the
following to your `app/assets/javascripts/application.js` file.

```javascript
//= require rails.validations
```

In your `FormBuilder` you only need to enable validations:

```erb
<%= form_for @user, :validate => true do |f| %>
  ...
```

That should be enough to get you going.

## Conditional Validators ##

By default conditional validators are not evaluated and passed to the client.
We do this because the state model when the form is rendered is not necessarily the state
of the model when the validations fire server-side. However, if you wish to override this behavior you can do so
in the form. Given the following model:

```ruby
class Person < ActiveRecord::Base
  validates :name, :email, :presence => true, :length => { :maximum => 10 }, :if => :can_validate?

  def can_validate
    true
  end
end
```

You can force in the form:

```erb
<%= f.text_field :name, :validate => true %>
```

Passing `:validate => true` will force all the validators for that attribute. If there are conditionals
they are evaluated with the state of the model when rendering the form. You can also force
individual validators:

```erb
<%= f.text_field :name :validate => { :presence => true } %>
```

In the above case only the `presence` validator will be passed to the client.

This is also the case with Procs, or any object that responds to `#call`

### Turning off validators ###

If you wish to skip validations on a given attribute force it to `false`:

```erb
<%= f.text_field :name, :validate => false %>
```

If you want to be more selective about the validation that is turned off you can simply do:

```erb
<%= f.text_field :name, :validate => { :presence => false } %>
```

## Understanding the embedded `<script>` tag ##

A rendered form with validations will always have a `<script>` appeneded
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
<%= form_for @user, :validate => true do |f| %>
  <p>
    <%= f.label :name %>
    <%= f.text_field :name %>
  </p>
  <%= f.validate :age, :bio %>
...
```

In the above example `age` and `bio` will not render as inputs on the form but their validators will be properly added to the `validators` object for use later. If you do intend to dynamically render these inputs later the `name` attributes on the inputs will have to match with the keys on the `validators` object, and the inputs will have to be enabled for client side validation.

## Plugins ##

There is additional support for other `ActiveModel` based ORMs and other
Rails `FormBuilders`. Please see the [Plugin wiki page](https://github.com/bcardarella/client_side_validations/wiki/Plugins)

* [SimpleForm](https://github.com/DockYard/client_side_validations-simple_form)
* [Formtastic](https://github.com/DockYard/client_side_validations-formtastic)
* [Mongoid](https://github.com/DockYard/client_side_validations-mongoid)
* [MongoMapper](https://github.com/DockYard/client_side_validations-mongo_mapper)
* [Turbolinks](https://github.com/DockYard/client_side_validations-turbolinks)

## Authors ##

[Brian Cardarella](http://twitter.com/bcardarella)

[We are very thankful for the many contributors](https://github.com/bcardarella/client_side_validations/graphs/contributors)

## Versioning ##

This gem follows [Semantic Versioning](http://semver.org)

Major and minor version numbers will follow `Rails`'s major and
minor version numbers. For example,
`client_side_validations-3.2.0` will be compatible up to 
`~> rails-3.2.0`

We will maintain compatibility with one minor version back. So the 3.2.0 version of
`client_side_validations` will be compatible with `~> rails-3.1.0`

Only two versions minor versions will be actively maintained.

## Want to help? ##

Stable branches are created based upon each minor version. Please make
pull requests to specific branches rather than master.

Please make sure you include tests!

We *do not* use the Ruby 1.9 hash syntax, please respect this and use the hashrocket.

Don't use tabs to indent, two spaces are the standard.

## Legal ##

[DockYard](http://dockyard.com), LLC &copy; 2012

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

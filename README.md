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
5. Wide browser compliancy. I've tested with IE8, seems to work OK.
6. Work with any ActiveModel::Validations based model
7. Validate nested fields
8. Support custom validations
9. Client side validation callbacks

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

This is also the case with Procs (or any object that responds to `#call`

### Turning off validators ###

If you wish to skip validations on a given attribute force it to `false`:

```erb
<%= f.text_field :name, :validate => false %>
```

If you want to be more selective about the validation that is turned off you can simply do:

```erb
<%= f.text_field :name, :validate => { :presence => false } %>
```

## Client Side Validation Callbacks ##
[See the wiki](https://github.com/bcardarella/client_side_validations/wiki/Callbacks)


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

Unles Rails drops support for Ruby 1.8.7 we will continue to use the
hash-rocket syntax. Please respect this.

Don't use tabs to indent, two spaces are the standard.

## Legal ##

[DockYard](http://dockyard.com), LLC &copy; 2012

[@dockyard](http://twitter.com/dockyard)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

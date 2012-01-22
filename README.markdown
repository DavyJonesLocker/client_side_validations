# ClientSideValidations #

[![Build Status](http://travis-ci.org/bcardarella/client_side_validations.png)](http://travis-ci.org/bcardarella/client_side_validations)

`ClientSideValidations` made easy for your Rails applications!

In addition to this README please checkout the [wiki](https://github.com/bcardarella/client_side_validations/wiki) and 
[ClientSideValidations GoogleGroup](http://groups.google.com/group/client_side_validations).

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

## Usage ##

The javascript file is served up in the asset pipeline. Add the
following to your `app/assets/javascripts/application.js` file.

```javascript
//= require rails.validations
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

## Client Side Validation Callbacks ##
[See the wiki](https://github.com/bcardarella/client_side_validations/wiki/Callbacks)


## Plugins ##

There is additional support for other `ActiveModel` based ORMs and other
Rails `FormBuilders`. Please see the [Plugin wiki page](https://github.com/bcardarella/client_side_validations/wiki/Plugins)

## Authors ##

[Brian Cardarella](http://twitter.com/bcardarella)

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

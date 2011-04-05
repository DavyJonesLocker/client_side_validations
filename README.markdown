# Rails 3 Client Side Validations #

Client Side Validations made easy for your Rails 3 applications!

In addition to this README please checkout the [wiki](https://github.com/bcardarella/client_side_validations/wiki)

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
9. Support custom FormBuilders like [SimpleForm](https://github.com/plataformatec/simple_form) and [Formtastic](https://github.com/justinfrench/formtastic)
10. Client side validation callbacks

## Install ##

Include Client Side Validations in your Gemfile

    gem 'client_side_validations', '3.0.1'

Then run the install generator

    rails g client_side_validations:install

This will install two files:

    config/initializers/client_side_validations.rb
    public/javascripts/rails.validations.js

## Upgrading ##

Always be sure to run

    rails g client_side_validations:install

After upgrading Client Side Validations. There is a good chance that the
rails.validations.js file has changed.

## Usage ##

Client Side Validations requires [jQuery](http://jquery.com) version >= 1.4.1

Include the client-side-validations.js file in your layout

    <%= javascript_include_tag 'jquery', 'rails.validations'-%>

Turn on the validations for each form_for

    <%= form_for @book, :validate => true do |book| -%>

Nested fields automatically inherit the :validate value. If you want to
turn it off just pass :validate => false to fields_for

    <%= book.fields_for :pages, :validate => false do |page| -%>

## Initializer ##

The initializer includes a commented out ActionView::Base.field_error_proc.
Uncomment this to render your error messages inline with the input fields.

I recommend you not use a solution similar to error_messages_for. Client
Side Validations is never going to support rendering these type of error
messages. If you want to maintain consistency between the client side
rendered validation error messages and the server side rendered
validation error messages please use what is in
config/initializers/client_side_validations.rb

## SimpleForm ##

Client Side Validations supports [SimpleForm](https://github.com/plataformatec/simple_form):

    <%= simple_form_for @book, :validate => true do |book| -%>

By default the latest version of SimpleForm will attach HTML5 Form
Validators. Client Side Validations will turn off the HTML5 Form
Validators if a given form is told to use Client Side Validations.

## Formtastic ##

Client Side Validations supports [Formtastic](https://github.com/justinfrench/formtastic):

    <%= semantic_form_for @book, :validate => true do |book| -%>

## Mongoid ##

Client Side Validations supports [Mongoid](https://github.com/mongoid/mongoid) >= 2.0

Anything before 2.0 won't work with Client Side Validations.

## Client Side Validation Callbacks ##
[See the wiki](https://github.com/bcardarella/client_side_validations/wiki/Callbacks)

## Legal ##

Brian Cardarella &copy; 2011

[@bcardarella](http://twitter.com/bcardarella)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

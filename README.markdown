# Rails 3 Client Side Validations #

Client Side Validations made easy for your Rails 3 applications!

In addition to this README please checkout the [wiki](https://github.com/bcardarella/client_side_validations/wiki)

## Project Goals ##

1. Automatically extract and apply validation rules defined on the
   server to the client.
2. In the cases where a server-side validation rule would not work on
   the client (i.e. conditional callbacks like :if, :unless) then do not
   attempt client side validations. Fall back to the server side
   validation.
3. The client side validation error rendering should be
   indistinguishable from the server side validation error rendering.
4. Wide browser compliancy. I've tested with IE8, seems to work OK.
5. Work with any ActiveModel::Validations based model
6. Validate nested fields
7. Support custom validations
8. Support alternative FormBuilders like [simple_form](https://github.com/plataformatec/simple_form)

## Install ##

Include Client Side Validations in your Gemfile

    gem 'client_side_validations', '3.0.0.alpha.4'

Then run the install generator

    rails g client_side_validations:install

This will install two files:

    config/initializers/client_side_validations.rb
    public/javascripts/client-side-validations.js

## Upgrading ##

Always be sure to run

    rails g client_side_validations:instlal

After upgrading Client Side Validations. There is a good chance that the
client-side-validations.js file has changed.

## Usage ##

Client Side Validations requires [jQuery](http://jquery.com).

Include the client-side-validations.js file in your layout

    <%= javascript_include_tag 'jquery', 'client-side-validations'-%>

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

Client Side Validations supports SimeplForm. However, there is a load
order issue. The ClientSideValidation gem must be required *before* the
SimpleForm gem.

Other than that, everything else should work as normal.

By default the latest version of SimpleForm will attach HTML5 Form
Validators. Client Side Validations will turn off the HTML5 Form
Validators if a given form is told to use Client Side Validations.


## Legal ##

Brian Cardarella &copy; 2011

[@bcardarella](http://twitter.com/bcardarella)

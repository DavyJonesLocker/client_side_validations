# Rails 3 Client Side Validations #

Client Side Validations made easy for your Rails 3 applications!

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

## Install ##

Include Client Side Validations in your Gemfile

    gem 'client_side_validations', '3.0.0.alpha.1'

Then run the install generator

    rails g client_side_validations:install

This will install two files:

    config/initializers/client_side_validations.rb
    public/javascripts/client-side-validations.js

## Usage ##

Client Side Validations required [jQuery](jQuery).

Include the client-side-validations.js file in your layout

    <%= javascript_include_tag 'client-side-validations' -%>

Turn on the validations for eahch form_for

    <%= form_for @book, :validate => true do |book| -%>

If you have nested fields you must also turn on validate for that block
as well

    <%= book.fields_for :pages, :validate => true do |page| -%>

## Initializer ##

The initializer includes a commented out ActionView::Base.field_error_proc.
Uncomment this to render your error messages inline with the input fields.

I recommend you not use a solution similar to error_messages_for. Client
Side Validations is never going to support rendering these type of error
messages. If you want to maintain consistency between the client side
rendered validation error messages and the server side rendered
validation error messages please use what is in
config/initializers/client_side_validations.rb



Brian Cardarella &copy; 2011

# Contribution Guidelines #

## Submitting a new issue ##

If you need to open a new issue you *must* provide the following:

1. Version of ClientSideValidations
2. Version of Rails
3. Code snippet from your model of the validations
4. The form code from your template
5. The resulting HTML

Failure to include the above mentioned requirements will result in the
issue being closed.

If you want to ensure that your issue gets fixed *fast* you should
attempt to reproduce the issue in an isolated example application that
you can share.

## Making a pull request ##

If you'd like to submit a pull request please adhere to the following:

1. Your code *must* be tested. Please TDD your code!
2. Make sure that `bundle exec rake` pass
3. Make sure that `bundle exec rake test:js` pass

Plase note that you must adhere to each of the above mentioned rules.
Failure to do so will result in an immediate closing of the pull
request. If you update and rebase the pull request to follow the
guidelines your pull request will be re-opened and considered for
inclusion.

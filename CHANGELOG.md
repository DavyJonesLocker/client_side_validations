# Changelog

## 21.0.0 / unreleased

* [FEATURE] Drop Ruby 2.5 support
* [ENHANCEMENT] Test against latest Ruby versions
* [ENHANCEMENT] Update development dependencies
* [ENHANCEMENT] Update QUnit to 2.19.0
* [ENHANCEMENT] Test against jQuery 3.6.1 by default

## 20.0.2 / 2021-12-22

* [BUGFIX] Fix Rails 7.0 compatibility ([#869](https://github.com/DavyJonesLocker/client_side_validations/issues/869))

## 20.0.1 / 2021-12-22

* [BUGFIX] Fix missing HTTP method ([#867](https://github.com/DavyJonesLocker/client_side_validations/issue/867))
* [ENHANCEMENT] Update development dependencies

## 20.0.0 / 2021-12-16

* [FEATURE] Add Rails 7 compatibility - POSSIBLE BREAKING CHANGE ([#862](https://github.com/DavyJonesLocker/client_side_validations/pull/862))
* [ENHANCEMENT] Update development dependencies

## 19.1.1 / 2021-11-15

* [ENHANCEMENT] Require MFA to publish gems
* [ENHANCEMENT] Update development dependencies

## 19.1.0 / 2021-10-05

* [FEATURE] Add Turbo compatibility ([#849](https://github.com/DavyJonesLocker/client_side_validations/pull/849))

## 19.0.0 / 2021-10-01

* [FEATURE] Add support to `other_than` numericality validator
* [FEATURE] Drop Ruby 2.4 support
* [FEATURE] Drop Rails 5.0 and 5.1 support
* [FEATURE] Drop legacy browsers support (including IE8 and IE9)
* [FEATURE] Drop Yarn < 1.19 and Node < 12.0 support
* [FEATURE] Add JavaScript sources to node package
* [ENHANCEMENT] Minor JS Refactor
* [ENHANCEMENT] Update development dependencies
* [ENHANCEMENT] Update QUnit to 2.17.2

## 18.1.0 / 2021-06-13

* [FEATURE] Add support to `fields` method ([#828](https://github.com/DavyJonesLocker/client_side_validations/pull/828))
* [ENHANCEMENT] Test against jQuery 3.6.0 by default
* [ENHANCEMENT] Test against latest Ruby versions
* [ENHANCEMENT] Update QUnit to 2.15.0

## 18.0.0 / 2021-02-13

* [FEATURE] Add Rails 7.0.pre compatibility
* [ENHANCEMENT] Default branch is now `main` **POSSIBLE BREAKING CHANGE!**
* [ENHANCEMENT] Update QUnit to 2.14.0
* [ENHANCEMENT] Update development dependencies

## 17.2.0 / 2020-11-03

* [FEATURE] Add Rails 6.1.0.rc1 compatibility
* [ENHANCEMENT] Update development dependencies

## 17.1.1 / 2020-10-31

* [ENHANCEMENT] Minor code cleanup
* [ENHANCEMENT] Update development dependencies

## 17.1.0 / 2020-10-10

* [FEATURE] Allow Ruby 3.0.0
* [ENHANCEMENT] Test against latest Ruby 2.7.2
* [ENHANCEMENT] Update QUnit to 2.11.3
* [ENHANCEMENT] Update development dependencies

## 17.0.0 / 2020-05-16

* [FEATURE] Drop Ruby 2.3 support
* [FEATURE] Do not require `jquery-rails` gem ([#785](https://github.com/DavyJonesLocker/client_side_validations/pull/785))
* [FEATURE] Add support for many association validations ([#783](https://github.com/DavyJonesLocker/client_side_validations/pull/783))
* [BUGFIX] Fix Rails generators ([#786](https://github.com/DavyJonesLocker/client_side_validations/pull/786))
* [BUGFIX] Do not validate dynamically disabled inputs ([#789](https://github.com/DavyJonesLocker/client_side_validations/pull/789))
* [BUGFIX] Fix removal of error messages ([#790](https://github.com/DavyJonesLocker/client_side_validations/pull/790))
* [ENHANCEMENT] Test against jQuery 3.5.1

## 16.2.0 / 2020-04-10

* [FEATURE] Add jQuery 3.5.0 compatibility ([#779](https://github.com/DavyJonesLocker/client_side_validations/pull/779))
* [ENHANCEMENT] Test against latest Ruby versions
* [ENHANCEMENT] Update development dependencies

## 16.1.1 / 2020-03-20

* [BUGFIX] Fix custom validators for nested attributes ([#778](https://github.com/DavyJonesLocker/client_side_validations/pull/778))
* [ENHANCEMENT] Update development dependencies

## 16.1.0 / 2019-12-25

* [FEATURE] Ruby 2.7 support
* [ENHANCEMENT] Update development dependencies
* [BUGFIX] Re-release of 16.0.4 because of wrong version number

## 16.0.4 / 2019-12-25

* [FEATURE] Ruby 2.7 support
* [ENHANCEMENT] Update development dependencies

## 16.0.3 / 2019-10-06

* [BUGFIX] Fix `validators.all` function
* [ENHANCEMENT] Update development dependencies

## 16.0.2 / 2019-09-21

* [BUGFIX] Guard against prototype extended arrays ([#769](https://github.com/DavyJonesLocker/client_side_validations/pull/769))
* [ENHANCEMENT] Test against latest Ruby versions
* [ENHANCEMENT] Update development dependencies

## 16.0.1 / 2019-08-24

* [BUGFIX] Fix default export (JS)

## 16.0.0 / 2019-08-23

* [FEATURE] Move to ES6
* [FEATURE] Add Webpacker compatibility
* [BUGFIX] Fix acceptance validator
* [ENHANCEMENT] Update development dependencies

## 15.0.0 / 2019-05-14

* [FEATURE] Drop Ruby 2.2 support
* [ENHANCEMENT] Test against jQuery 3.4.1 by default
* [ENHANCEMENT] Update development dependencies

## 14.1.0 / 2019-04-25

* [FEATURE] Add Rails 6.0 compatibility

## 14.0.0 / 2019-04-23

* [FEATURE] Add form_with support
* [ENHANCEMENT] Test against jQuery 3.4.0 by default

## 13.1.0 / 2019-03-14

* [FEATURE] Add Rails 6.0.0.beta3 compatibility
* [ENHANCEMENT] Test against Ruby 2.6.2
* [ENHANCEMENT] Update QUnit to 2.9.2
* [ENHANCEMENT] Update dependencies

## 13.0.0 / 2019-03-01

* [FEATURE] Add Rails 6.0.0.beta2 compatibility
* [BUGFIX] Fix case-sensitive uniqueness validator (potential breaking change) ([#753](https://github.com/DavyJonesLocker/client_side_validations/issues/753))
* [ENHANCEMENT] Test against Ruby 2.6.1
* [ENHANCEMENT] Update dependencies

## 12.1.0 / 2019-01-21

* [FEATURE] Add Rails 6.0.0.beta1 compatibility
* [ENHANCEMENT] Test against Ruby 2.6.0, Ruby edge, and Rails edge
* [ENHANCEMENT] Update dependencies

## 12.0.0 / 2018-12-12

* [FEATURE] Drop the deprecated tokenizer support in length validator
* [ENHANCEMENT] Do not use `New Function` ([#733](https://github.com/DavyJonesLocker/client_side_validations/issues/733))
* [ENHANCEMENT] Remove 'g' flag from RegExp conversions ([#750](https://github.com/DavyJonesLocker/client_side_validations/issues/750))
* [ENHANCEMENT] Update dependencies

## 11.1.3 / 2018-09-08

* [ENHANCEMENT] Test against jQuery 3.3.1 by default
* [ENHANCEMENT] Update QUnit to 2.6.2
* [ENHANCEMENT] Update dependencies

## 11.1.2 / 2018-04-08

* [BUGFIX] Fix support for allow_nil option ([#737](https://github.com/DavyJonesLocker/client_side_validations/issues/737))
* [ENHANCEMENT] Test against Ruby 2.2.10, 2.3.7, 2.4.4, and 2.5.1

## 11.1.1 / 2018-03-19

* [ENHANCEMENT] Update dependencies

## 11.1.0 / 2018-02-02

* [FEATURE] Rails 5.2 support
* [ENHANCEMENT] Test against Ruby 2.2.9, 2.3.6, 2.4.3, and 2.5.0
* [ENHANCEMENT] Test against jQuery 3.3.1
* [ENHANCEMENT] Update development dependencies

## 11.0.0 / 2017-11-29

* [BUGFIX] Fix association validations (potential breaking change) ([#712](https://github.com/DavyJonesLocker/client_side_validations/issues/712))

## 10.1.0 / 2017-11-28

* [FEATURE] Rails 5.2.0.beta2 support
* [ENHANCEMENT] Update development dependencies

## 10.0.2 / 2017-11-11

* [BUGFIX] Fix jQuery 3.0 support ([#726](https://github.com/DavyJonesLocker/client_side_validations/pull/726))
* [ENHANCEMENT] Update development dependencies

## 10.0.1 / 2017-10-10

* [BUGFIX] Fix regression in JavaScript numericality validator ([#724](https://github.com/DavyJonesLocker/client_side_validations/issues/724))

## 10.0.0 / 2017-10-09

* [FEATURE] Refactor client-side numericality validator ([#717](https://github.com/DavyJonesLocker/client_side_validations/issues/717))
* [ENHANCEMENT] Test against Ruby 2.2.8, 2.3.5, and 2.4.2
* [ENHANCEMENT] Update js_regex runtime depenency to 2.0
* [ENHANCEMENT] Update development dependencies

## 9.3.4 / 2017-07-15

* [BUGFIX] Validate will_save_change_to? conditionals
* [ENHANCEMENT] Test against jQuery slim 3.x

## 9.3.3 / 2017-06-01

* [BUGFIX] Fix JavaScript confirmation validator ([#706](https://github.com/DavyJonesLocker/client_side_validations/issues/706))
* [ENHANCEMENT] Update development dependencies

## 9.3.2 / 2017-05-27

* [BUGFIX] Fix a regression in fields_for ([#680](https://github.com/DavyJonesLocker/client_side_validations/issues/680))
* [ENHANCEMENT] Update development dependencies

## 9.3.1 / 2017-05-04

* [BUGFIX] Fix a regression in validates_with validators ([#702](https://github.com/DavyJonesLocker/client_side_validations/pull/702))

## 9.3.0 / 2017-04-24

* [ENHANCEMENT] Code cleanup
* [ENHANCEMENT] Test against Ruby 2.2.7 and 2.3.4, Rails 5.1.0.rc2
* [ENHANCEMENT] Update development dependencies

## 9.2.0 / 2017-03-23

* [ENHANCEMENT] Use Ruby 2.3's Frozen String Literal Pragma
* [ENHANCEMENT] Code cleanup
* [ENHANCEMENT] Test against Ruby 2.4.1 and Rails 5.1.0.rc1
* [ENHANCEMENT] Test against jQuery 3.2.0 and 3.2.1
* [ENHANCEMENT] Update jquery-rails runtime depenency to 4.3
* [ENHANCEMENT] Update development dependencies

## 9.1.0 / 2017-03-07

* [ENHANCEMENT] Rails 5.1 compatibility
* [ENHANCEMENT] Support deeply nested attributes ([#697](https://github.com/DavyJonesLocker/client_side_validations/pull/697))

## 9.0.1 / 2017-02-06

* [BUGFIX] Fix file fields ([#694](https://github.com/DavyJonesLocker/client_side_validations/issues/694))
* [ENHANCEMENT] Follow Vandamme's changelog conventions

## 9.0.0 / 2017-01-31

* [FEATURE] Unobtrusive JavaScript

## 8.0.2 / 2017-01-31

* [ENHANCEMENT] Under the hood improvements
* [ENHANCEMENT] Update tests

## 8.0.1 / 2017-01-26

* [ENHANCEMENT] Under the hood improvements to the form helper
* [ENHANCEMENT] Include license in the gem

## 8.0.0 / 2017-01-22

* [PERFORMANCE] Change internals to get 4.0 score on Code Climate

## 7.0.1 / 2017-01-22

* [BUGFIX] Fix `rails.validations` asset not found error

## 7.0.0 / 2017-01-22

* [SECURITY] Remove middleware for remote validations
* [ENHANCEMENT] Update development dependencies

## 6.0.0 / 2017-01-20

* [FEATURE] Rails 5.0 compatibility
* [FEATURE] Drop Rails 4.x support

## 4.2.12 / 2017-01-19

* [FEATURE] Add Changelog ([#688](https://github.com/DavyJonesLocker/client_side_validations/issues/688))
* [FEATURE] Drop Ruby 2.0.0 support
* [ENHANCEMENT] Test against jQuery from 1.7.2 to 3.1.1
* [ENHANCEMENT] Minor changes

## 4.2.11 / 2016-12-08

* [BUGFIX] Fix conditional validators ([#686](https://github.com/DavyJonesLocker/client_side_validations/issues/686))

## 4.2.10 / 2016-11-16

* [BUGFIX] Fix dollar sign in regular expression ([#684](https://github.com/DavyJonesLocker/client_side_validations/issues/684))

## 4.2.9 / 2016-11-11

* [BUGFIX] Fix jQuery 3 compatibility

## 4.2.8 / 2016-11-11

* [BUGFIX] Fix numericality validator ([#679](https://github.com/DavyJonesLocker/client_side_validations/pull/679))

## 4.2.7 / 2016-10-08

* [BUGFIX] Prevent undesired `stopPropagation` on `focusout` event ([#675](https://github.com/DavyJonesLocker/client_side_validations/pull/675))

## 4.2.6 / 2016-09-10

* [ENHANCEMENT] Add some clarity to the `copy_assets` command ([#671](https://github.com/DavyJonesLocker/client_side_validations/pull/671))
* [ENHANCEMENT] Minor changes

## 4.2.5 / 2016-07-06

* [BUGFIX] Make helpers consistent with their Rails counterparts ([#665](https://github.com/DavyJonesLocker/client_side_validations/issues/665))
* [ENHANCEMENT] Minor changes

## 4.2.4 / 2016-06-14

* [FEATURE] Add Turbolinks 5 compatibility
* [FEATURE] Drop Ruby 1.9 support
* [ENHANCEMENT] Test against Ruby 2.1.10, 2.2.5 and 2.3.1
* [ENHANCEMENT] Test against jQuery 1.12.4

## 4.2.3 / 2016-03-14

* [ENHANCEMENT] Test against jQuery 1.12.1
* [ENHANCEMENT] Minor changes

## 4.2.2 / 2016-02-28

* [SECURITY] Fix uniqueness validator data disclosure ([#648](https://github.com/DavyJonesLocker/client_side_validations/issues/648))
* [BUGFIX] Fix config.root_path to work in middleware ([#598](https://github.com/DavyJonesLocker/client_side_validations/pull/598))
* [ENHANCEMENT] Minor changes

## 4.2.1 / 2016-01-15

* [ENHANCEMENT] Test against jQuery 1.12.0
* [ENHANCEMENT] Minor changes

## 4.2.0 / 2016-01-07

* [FEATURE] First Rails 4.x compatible version

For older versions, please refer to [GitHub releases](https://github.com/DavyJonesLocker/client_side_validations/releases)

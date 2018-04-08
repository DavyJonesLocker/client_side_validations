# Changelog

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

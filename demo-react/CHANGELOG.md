# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.1"></a>
## [2.0.1](https://github.com/jeffhandley/strickland/compare/v2.0.0...v2.0.1) (2018-04-05)


### Bug Fixes

* do not treat boolean values as empty values ([8840ee9](https://github.com/jeffhandley/strickland/commit/8840ee9))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/jeffhandley/strickland/compare/v2.0.0-rc.2...v2.0.0) (2018-04-03)




**Note:** Version bump only for package demo

<a name="2.0.0-rc.2"></a>
# [2.0.0-rc.2](https://github.com/jeffhandley/strickland/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2018-03-16)




**Note:** Version bump only for package demo

<a name="2.0.0-rc.1"></a>
# [2.0.0-rc.1](https://github.com/jeffhandley/strickland/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2018-03-15)




**Note:** Version bump only for package demo

<a name="2.0.0-rc.0"></a>
# [2.0.0-rc.0](https://github.com/jeffhandley/strickland/compare/v2.0.0-beta.4...v2.0.0-rc.0) (2018-03-13)


### Features

* add clearResults, validateField, updateFieldResult helpers on form ([3b2be71](https://github.com/jeffhandley/strickland/commit/3b2be71))
* change updateFieldResult to updateFieldResults (supporting multiple fields) ([fa8859b](https://github.com/jeffhandley/strickland/commit/fa8859b))




<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/jeffhandley/strickland/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2018-03-12)




**Note:** Version bump only for package demo

<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/jeffhandley/strickland/compare/v2.0.0-beta.1...v2.0.0-beta.4) (2018-03-12)


### Features

* simplification of the API and rename of props to objectProps ([4129242](https://github.com/jeffhandley/strickland/commit/4129242))


### BREAKING CHANGES

* The `getValidatorProps` approach was causing some usability troubles:

1. Constructing validators became unpredictable
* The built-in validators were quite powerful, yes, but they were simply _too_ flexible
* The overabundance of flexibility made it hard to grok what was happening because there was too much magic
2. Creating validators became too difficult
* It raised the bar too high for validator authors to adopt the same level of magic flexibility
* And it was unclear what would happen if some validators did not adhere

To address these issues:

1. Validators no longer take ordinal params in the flexible way -- instead, there's just a single props object supplied
2. That props param can be a function that returns the props object
3. Context is passed to said function, but there's just a single props object/function now instead of a magic chain of them
4. The `validate` function reliably puts `value` on context and the result props -- no validators are responsible for doing that

Even though using a props object parameter is more verbose for basic scenarios, it makes the API more predictable and therefore approachable.

Additionally, the `props` validator was badly named.  The "props" concept is used throughout Strickland and the name collision between concept and validator was hard to keep clear.  It is now named `objectProps`.




<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/jeffhandley/strickland/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2018-03-07)




**Note:** Version bump only for package demo

<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/jeffhandley/strickland/compare/v1.1.0...v2.0.0-beta.2) (2018-03-04)


### Features

* support deferred async validation ([f48694a](https://github.com/jeffhandley/strickland/commit/f48694a))
* updating demo to use form validation ([7393155](https://github.com/jeffhandley/strickland/commit/7393155))


### BREAKING CHANGES

* The validateAsync result prop is now a function instead of a Promise. The function will return a Promise, allowing the Promise to be deferred until validateAsync is called.  Validators can now return either a Promise or a function to opt into async validation, or put either a Promise or a function on the result as the validateAsync result prop.  Results will always be normalized to have validateAsync be a function that returns a Promise.




<a name="1.1.0"></a>
# [1.1.0](https://github.com/jeffhandley/strickland/compare/v1.0.0...v1.1.0) (2018-01-21)




**Note:** Version bump only for package demo

<a name="1.0.0"></a>
# [1.0.0](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.11...v1.0.0) (2018-01-15)




**Note:** Version bump only for package demo

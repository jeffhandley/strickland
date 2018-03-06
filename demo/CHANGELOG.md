# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

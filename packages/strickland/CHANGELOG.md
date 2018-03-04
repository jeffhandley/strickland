# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/jeffhandley/strickland/compare/v1.1.0...v2.0.0-beta.2) (2018-03-04)


### Bug Fixes

* always provide a context object from validate ([b6ee1a8](https://github.com/jeffhandley/strickland/commit/b6ee1a8))


### Features

* add a form validator that can be used for incremental form validation ([c404d50](https://github.com/jeffhandley/strickland/commit/c404d50))
* add a new prepareProps utility and use it in compare to support props and context ([b8e1c00](https://github.com/jeffhandley/strickland/commit/b8e1c00))
* support deferred async validation ([f48694a](https://github.com/jeffhandley/strickland/commit/f48694a))
* support props and context on compare, max, maxLength, min, minLength, and required ([1c705cd](https://github.com/jeffhandley/strickland/commit/1c705cd))
* support props and context on form ([e9fa448](https://github.com/jeffhandley/strickland/commit/e9fa448))
* support props and context on length and range ([6292b02](https://github.com/jeffhandley/strickland/commit/6292b02))
* support validator props and context on each, every, some, and props ([ce80a29](https://github.com/jeffhandley/strickland/commit/ce80a29))
* updating demo to use form validation ([7393155](https://github.com/jeffhandley/strickland/commit/7393155))


### BREAKING CHANGES

* The validateAsync result prop is now a function instead of a Promise. The function will return a Promise, allowing the Promise to be deferred until validateAsync is called.  Validators can now return either a Promise or a function to opt into async validation, or put either a Promise or a function on the result as the validateAsync result prop.  Results will always be normalized to have validateAsync be a function that returns a Promise.




<a name="1.1.0"></a>
# [1.1.0](https://github.com/jeffhandley/strickland/compare/v1.0.0...v1.1.0) (2018-01-21)


### Bug Fixes

* compare with a value of 0 should actually validate ([d0f6fe1](https://github.com/jeffhandley/strickland/commit/d0f6fe1))
* include length on context passed to minLength and maxLength functions ([d61436a](https://github.com/jeffhandley/strickland/commit/d61436a))


### Features

* pass validation context to parameter functions ([b466e9f](https://github.com/jeffhandley/strickland/commit/b466e9f))




<a name="1.0.0"></a>
# [1.0.0](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.11...v1.0.0) (2018-01-15)


### Bug Fixes

* move jest to dev dependencies ([cf3cf3b](https://github.com/jeffhandley/strickland/commit/cf3cf3b))


### Features

* allow context for specific props ([8f721a8](https://github.com/jeffhandley/strickland/commit/8f721a8))




<a name="1.0.0-rc.11"></a>
# [1.0.0-rc.11](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.10...v1.0.0-rc.11) (2018-01-02)


### Features

* another change to async validation; now using validateAsync and validate never returns a Promise ([ca5d2fe](https://github.com/jeffhandley/strickland/commit/ca5d2fe))



<a name="1.0.0-rc.10"></a>
# [1.0.0-rc.10](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.9...v1.0.0-rc.10) (2017-12-30)


### Features

* rename resolvePromise to async and allow async: true on context, forcing a promise to be returned ([42d1501](https://github.com/jeffhandley/strickland/commit/42d1501))



<a name="1.0.0-rc.9"></a>
# [1.0.0-rc.9](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.8...v1.0.0-rc.9) (2017-12-26)


### Bug Fixes

* Re-implemented async again after realizing props, each, every, and some were conflating their responsibilities with validate and they were not returning granular promises--turned async into a new convention favoring resolvePromise at the core. ([9d41daf](https://github.com/jeffhandley/strickland/commit/9d41daf))



<a name="1.0.0-rc.8"></a>
# [1.0.0-rc.8](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.7...v1.0.0-rc.8) (2017-12-24)


### Features

* reimplemented async validation to allow for partial results to be returned; fixed several sync bugs ([5ee7bcb](https://github.com/jeffhandley/strickland/commit/5ee7bcb))
* taking another stab at async in preparation for returning partial results when needed. refactored each, every, some, and props to clean them up more and make them more consistent. ([bbc707f](https://github.com/jeffhandley/strickland/commit/bbc707f))



<a name="1.0.0-rc.5"></a>
# [1.0.0-rc.5](https://github.com/jeffhandley/strickland/compare/v1.0.0-rc.3...v1.0.0-rc.5) (2017-12-22)


### Bug Fixes

* min was not invalid for non-numbers; neither min nor max were testing for that ([250bda3](https://github.com/jeffhandley/strickland/commit/250bda3))
* props should create a props prop on the result when the nested prop is missing; refactor to prepare for async props ([5f3874c](https://github.com/jeffhandley/strickland/commit/5f3874c))


### Features

* added some and each validators and added new features to the README ([fc3965c](https://github.com/jeffhandley/strickland/commit/fc3965c))
* every now works with async validators ([62baf40](https://github.com/jeffhandley/strickland/commit/62baf40))
* support async props validation ([207a096](https://github.com/jeffhandley/strickland/commit/207a096))
* support async validators in the validate function (but not yet in every or props) ([0b140b3](https://github.com/jeffhandley/strickland/commit/0b140b3))



<a name="1.0.0-rc.0"></a>
# [1.0.0-rc.0](https://github.com/jeffhandley/strickland/compare/0.0.8...1.0.0-rc.0) (2017-12-20)


### Bug Fixes

* compare needs to allow for the compare prop to be specified only at validation time -- do not throw ([e444c45](https://github.com/jeffhandley/strickland/commit/e444c45))
* compare should not use trim ([3cd654b](https://github.com/jeffhandley/strickland/commit/3cd654b))
* do not mutate props objects ([5de29dc](https://github.com/jeffhandley/strickland/commit/5de29dc))
* fix validation triggers ([84ab126](https://github.com/jeffhandley/strickland/commit/84ab126))
* illustrate object validation after property validation; fix object validation bug ([5e9a460](https://github.com/jeffhandley/strickland/commit/5e9a460))
* mention pure JavaScript at the end of the README ([e35122e](https://github.com/jeffhandley/strickland/commit/e35122e))
* remove ability to return a string from a validator as a message; clean up validate code ([3168407](https://github.com/jeffhandley/strickland/commit/3168407))
* remove value parsing functionality ([53ec17e](https://github.com/jeffhandley/strickland/commit/53ec17e))
* renamed rangeLength to length ([38e7a57](https://github.com/jeffhandley/strickland/commit/38e7a57))
* return objects when boolean results are provided ([e5e679e](https://github.com/jeffhandley/strickland/commit/e5e679e))
* revalidate the entire form on field blur once the form is validated ([adca6d7](https://github.com/jeffhandley/strickland/commit/adca6d7))
* trim by default on compare, minLength, maxLength; allow override ([0f17ff3](https://github.com/jeffhandley/strickland/commit/0f17ff3))


### Features

* ability to use a rules function with a string result ([20aaffa](https://github.com/jeffhandley/strickland/commit/20aaffa))
* ability to use a rules function with an object with or without isValid ([43679f8](https://github.com/jeffhandley/strickland/commit/43679f8))
* ability to use a rules function with true/false ([44e8c7c](https://github.com/jeffhandley/strickland/commit/44e8c7c))
* add more result output and create a compare validator ([1aef8ae](https://github.com/jeffhandley/strickland/commit/1aef8ae))
* added range validator and improved min/max argument handling ([a679937](https://github.com/jeffhandley/strickland/commit/a679937))
* added rangeLength validator ([014c626](https://github.com/jeffhandley/strickland/commit/014c626))
* adding a maxValue validator ([213bcdf](https://github.com/jeffhandley/strickland/commit/213bcdf))
* adding a minLength and maxLength validators ([2d4798c](https://github.com/jeffhandley/strickland/commit/2d4798c))
* adding a minValue validator ([acd46a9](https://github.com/jeffhandley/strickland/commit/acd46a9))
* adding a required validator ([8c0c73e](https://github.com/jeffhandley/strickland/commit/8c0c73e))
* allow compare to be given a function to get the compare value ([a9ffae2](https://github.com/jeffhandley/strickland/commit/a9ffae2))
* allow props to be passed in at validation time ([2c75da8](https://github.com/jeffhandley/strickland/commit/2c75da8))
* allow props to be passed to parse functions to skip trimming passwords ([62a35b8](https://github.com/jeffhandley/strickland/commit/62a35b8))
* allow validate to take an array of functions; use the feature for range/rangeLength ([109f047](https://github.com/jeffhandley/strickland/commit/109f047))
* allow validation-time prop specification across the board and allow functions for known props ([bcac4ca](https://github.com/jeffhandley/strickland/commit/bcac4ca))
* always return results as objects with an isValid prop ([1f616f5](https://github.com/jeffhandley/strickland/commit/1f616f5))
* automatically pass validate props and value through to the result ([d26eda1](https://github.com/jeffhandley/strickland/commit/d26eda1))
* create a composite validator to spread props over multiple validators ([a74810b](https://github.com/jeffhandley/strickland/commit/a74810b))
* create a composite validator to spread props over multiple validators ([9313ea0](https://github.com/jeffhandley/strickland/commit/9313ea0))
* delete composite validator as every now fulfills the same functionality ([5dedb2f](https://github.com/jeffhandley/strickland/commit/5dedb2f))
* export validators from index ([fd905dd](https://github.com/jeffhandley/strickland/commit/fd905dd))
* extract an every validator with validator results on an every prop; props puts prop results onto props to align ([a01f555](https://github.com/jeffhandley/strickland/commit/a01f555))
* flesh out value parsing on required ([fdb8f7b](https://github.com/jeffhandley/strickland/commit/fdb8f7b))
* include a required=true prop on required results ([23c8281](https://github.com/jeffhandley/strickland/commit/23c8281))
* remove the isValid helper function; it was no longer needed or helpful ([a8b3b0f](https://github.com/jeffhandley/strickland/commit/a8b3b0f))
* renamed minValue and maxValue to min/max ([c850371](https://github.com/jeffhandley/strickland/commit/c850371))
* starting over with fresh approach ([601d926](https://github.com/jeffhandley/strickland/commit/601d926))
* support nested object validation ([789f9e2](https://github.com/jeffhandley/strickland/commit/789f9e2))
* support validating objects ([5a48d78](https://github.com/jeffhandley/strickland/commit/5a48d78))
* wrote a new README ([12e578f](https://github.com/jeffhandley/strickland/commit/12e578f))


### BREAKING CHANGES

* redefining the API

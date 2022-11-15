# Contributing

_This document is a work in progress_

Pull requests are accepted in Strickland. Please note that even pull requests are thoughtfully considered against the [design goals](https://www.strickland.io/design-goals) of Strickland and there is often a delay before a PR will be accepted.

## Building and Testing

Build and test steps were developed and tested on macOS; they have not been tested on Linux or Windows.

1. `git clone`
2. `npm install` (yarn is not currently supported)
3. `npm run build`
    * Build the mono-repo through Lerna
    * Run ESLint
    * Run Jest unit tests with code coverage

Unit test coverage is expected to remain at 100% within the `main` branch.

## Folder Structure

This repository is set up as a Lerna mono-repo, containing the following folders:

* demo-react
    * A demo application using React
* docs
    * The markdown-based documentation
    * Managed through GitBook, with the subfolder structure being dictated by GitBook
* logo
    * Logo files for Strickland
    * Feel free to use these logos when linking to Strickland.io or to this GitHub repository
* strickland
    * The `strickland` npm package

## Publishing

To publish a new version of Strickland to NPM:

1. Ensure `npm whoami` shows that you are logged in
2. Use a `release/` branch to perform the release steps
3. Push the branch to `origin` using `--set-upstream`
4. Run `npm run publish:release` or `npm run:prerelease`
5. Commit the `CHANGELOG.md` file and push the branch to `origin`
6. Merge the PR

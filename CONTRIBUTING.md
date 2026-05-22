# Contributing to Bigodon

## Suggesting helpers/features

If you're using Bigodon and you found something that wasn't easy to template, we'd love to hear it from you! Open a [feature request](https://github.com/mocko-app/bigodon/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=) or a [helper idea](https://github.com/mocko-app/bigodon/issues/new?assignees=&labels=enhancement&template=helper-idea.md&title=).

If you're confortable with [Bigodon's code](#Cloning-Bigodon), you can also open a PR with the implementation of your feature after the issue is reviewed.

## Reporting bugs

If Bigodon didn't work as expected, please let us know by opening a [bug report](https://github.com/mocko-app/bigodon/issues/new?assignees=&labels=bug&template=bug_report.md&title=).

If you're confortable with [Bigodon's code](#Cloning-Bigodon), you can also open a PR with a failing test expecting the behavior you want. If you're even more comfortable with the code, you can also open a PR with a fix for the bug.

## Asking questions

If something wasn't clear from the documentation, or if you have any questions, please open an [issue](https://github.com/mocko-app/bigodon/issues/new), we're happy to help! Showing us what's not clear from the docs makes it easier for new users to get started.

After the issue is reviewed, feel free to open a PR updating the documentation.

## Opening PRs

If you find an [Issue](https://github.com/mocko-app/bigodon/contribute) you'd like to address, please open a PR!

## Cloning Bigodon

First, clone the repository and install the dependencies:
```bash
git clone https://github.com/mocko-app/bigodon.git
cd bigodon
npm install
```

Now you're ready to code! After changing anything, make sure the tests still pass:
```bash
npm test
```

If you'd like to use your local version of Bigodon in your project, you can create a link with npm. Inside your `bigodon` folder:
```bash
npm link
```
...and inside the project you want to use it:
```bash
npm link bigodon
```

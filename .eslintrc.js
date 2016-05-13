module.exports = {
    'parser': 'babel-eslint',

    'env': {
        'browser': true,
        'node': true,
        'es6': true,
        'mocha': true
    },

    'rules': {
        'indent': [2, 4, { 'SwitchCase': 1 }],
        'brace-style': 2,
        'comma-style': [2, 'last'],
        'default-case': 2,
        'guard-for-in': 2,
        'no-floating-decimal': 2,
        'no-nested-ternary': 2,
        'no-undefined': 2,
        'no-multi-spaces': 2,
        'no-unused-vars': 2,
        'radix': 2,
        'keyword-spacing': 2,
        'space-before-blocks': 2,
        'space-before-function-paren': [2, 'never'],
        'spaced-comment': [0, 'always', { 'exceptions': ['-']}],
        'strict': [2, 'global'],
        'wrap-iife': [2, 'any'],
        'quotes': [2, 'single'],
        'jsx-quotes': [ 2, 'prefer-single' ],
        'react/jsx-boolean-value': 2,
        'react/jsx-no-undef': 2,
        'react/jsx-sort-props': 2,
        'react/jsx-uses-react': 2,
        'react/jsx-uses-vars': 2,
        'react/display-name': 2,
        'react/no-did-mount-set-state': 2,
        'react/no-did-update-set-state': 2,
        'react/no-multi-comp': 2,
        'react/no-unknown-property': 2,
        'react/prop-types': 2,
        'react/react-in-jsx-scope': 2,
        'react/self-closing-comp': 2,
        'react/sort-prop-types': 2,
        'react/wrap-multilines': 2,

        'eqeqeq': 2,
        'eol-last': 2,
        'handle-callback-err': 2,
        'comma-dangle': [2, 'never'],
        'no-cond-assign': 2,
        'no-console': 0,
        'no-constant-condition': 2,
        'no-control-regex': 2,
        'no-debugger': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty-character-class': 2,
        'no-empty': 2,
        'no-ex-assign': 2,
        'no-extra-boolean-cast': 2,
        'no-extra-parens': 0,
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-inner-declarations': 2,
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-negated-in-lhs': 2,
        'no-obj-calls': 2,
        'no-regex-spaces': 2,
        'quote-props': [2, 'as-needed', { 'keywords': true, 'unnecessary': false }],
        'no-sparse-arrays': 2,
        'no-unreachable': 2,
        'use-isnan': 2,
        'valid-jsdoc': 2,
        'valid-typeof': 2,
        'no-underscore-dangle': 0,
        'semi': 0,
        'semi-spacing': 2,
        'dot-notation': 2,
        'space-infix-ops': 2,
        'comma-spacing': 2,
        'new-cap': 2,
        'no-extra-bind': 2,
        'no-shadow': 2,
        'no-undef': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-spaced-func': 2,
        'no-loop-func': 2,
        'key-spacing': 2,
        'no-trailing-spaces': 2,
        'camelcase': 2
    },

    'ecmaFeatures': {
        'modules': true,
        'jsx': true
    },

    'plugins': [
        'react'
    ]
}
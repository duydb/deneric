module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true
    },
    extends: ['standard'],
    rules: {
        indent: [0, 2],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        camelcase: 0,
        'space-before-function-paren': 0
    }
}
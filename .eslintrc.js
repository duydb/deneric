module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  "env": {
    "browser": true
  },
  "extends": ["standard"],
  "rules": {
    "indent": [0, 4],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "space-before-function-paren": 0
  }
};
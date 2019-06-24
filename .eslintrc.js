module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    app: true,
    td: true,
    describe: true,
    it: true,
    before: true,
    after: true,
    request: true,
    expect: true,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-param-reassign": "off"
  },
};

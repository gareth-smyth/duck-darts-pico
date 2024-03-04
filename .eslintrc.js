module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  ignorePatterns: ['coverage', 'dist', 'node_modules'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: [2, 'always']
  }
};

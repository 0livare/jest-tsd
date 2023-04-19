// Babel is only used for running tests, not for building the library.
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: '3.22',
      },
    ],
    '@babel/preset-typescript',
  ],
}

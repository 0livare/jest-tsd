// Babel is only used for running tests, not for building the library.
module.exports = {
  env: {
    test: {
      presets: [['@babel/preset-env', {targets: {node: 'current'}}], '@babel/preset-typescript'],
    },
  },
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        bugfixes: true,
        loose: true,
        modules: false,
        corejs: 3
      }
    ]
  ]
}

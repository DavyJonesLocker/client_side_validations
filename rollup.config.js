import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      {
        file: pkg.browser,
        format: 'umd',
        name: 'clientSideValidations',
        globals: {
          jquery: '$'
        }
      }
    ],
    plugins: [
      resolve(), // so Rollup can find `jquery`
      commonjs(), // so Rollup can convert `jquery` to an ES module
      babel({
        exclude: ['node_modules/**']
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]

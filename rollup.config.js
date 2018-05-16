import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import license from 'rollup-plugin-license'
import fs from 'fs'
import path from 'path'

const versionPath = path.join(__dirname, 'lib', 'client_side_validations', 'version.rb')
const version = fs.readFileSync(versionPath, 'utf8').match(/'[\d.]*'/gm).join().replace(/'/g, '')
const year = new Date().getFullYear()
const banner = `
* Client Side Validations - v${version} (https://github.com/DavyJonesLocker/client_side_validations)
* Copyright (c) ${year} Geremia Taglialatela, Brian Cardarella
* Licensed under MIT (http://opensource.org/licenses/mit-license.php)
`

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
      license({ banner }),
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
      license({ banner }),
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]

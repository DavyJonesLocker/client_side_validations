import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'
import fs from 'fs'
import path from 'path'

const versionPath = path.join(__dirname, 'lib', 'client_side_validations', 'version.rb')
const version = fs.readFileSync(versionPath, 'utf8').match(/'[\d.]*'/gm).join().replace(/'/g, '')
const year = new Date().getFullYear()
const banner = `/*!
 * Client Side Validations - v${version} (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) ${year} Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (http://opensource.org/licenses/mit-license.php)
 */
`

const packagePath = path.join(__dirname, 'package.json')

fs.readFileSync(packagePath, 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    const obj = JSON.parse(data)
    obj.version = version
    const json = JSON.stringify(obj, null, 2)
    fs.writeFile(packagePath, `${json} \n`, 'utf8')
  }
})

export default [
  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      {
        file: pkg.browser,
        banner,
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
      }),
      copy({
        'dist/client-side-validations.js': 'vendor/assets/javascripts/rails.validations.js',
        verbose: true
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
      { file: pkg.main, format: 'cjs', banner },
      { file: pkg.module, format: 'es', banner }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]

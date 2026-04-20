import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const year = new Date().getFullYear()

const banner = `/*!
 * Client Side Validations JS - v${pkg.version} (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) ${year} Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */
`

export default [
  {
    input: 'src/index.js',
    external: ['@hotwired/stimulus'],
    output: [
      {
        file: pkg.module,
        banner,
        format: 'es'
      }
    ],
    plugins: [
      resolve(),
      babel({ babelHelpers: 'bundled' })
    ]
  },

  // Self-contained bundle used by the QUnit browser test suite. Not published.
  {
    input: 'test/javascript/test-bundle.js',
    output: [
      {
        file: 'test/javascript/public/vendor/test-bundle.js',
        format: 'iife',
        name: 'ClientSideValidationsTestBundle'
      }
    ],
    plugins: [
      resolve(),
      babel({ babelHelpers: 'bundled' })
    ]
  }
]

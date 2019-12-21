import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

const year = new Date().getFullYear()

const banner = `/*!
 * Client Side Validations JS - v${pkg.version} (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) ${year} Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */
`

export default [
  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      {
        file: pkg.main,
        banner,
        format: 'umd',
        name: 'ClientSideValidations',
        globals: {
          jquery: '$'
        }
      }
    ],
    plugins: [
      resolve(),
      babel(),
      copy({
        targets: [
          { src: pkg.main, dest: 'vendor/assets/javascripts/', rename: 'rails.validations.js' }
        ],
        hook: 'writeBundle',
        verbose: true
      })
    ]
  },

  {
    input: 'src/main.js',
    external: ['jquery'],
    output: [
      {
        file: pkg.module,
        banner,
        format: 'es'
      }
    ],
    plugins: [
      babel()
    ]
  }
]

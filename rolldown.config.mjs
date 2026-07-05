import { defineConfig } from 'rolldown'
import { createRequire } from 'node:module'
import fs from 'node:fs'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const year = new Date().getFullYear()

const banner = `/*!
 * Client Side Validations JS - v${pkg.version} (https://github.com/DavyJonesLocker/client_side_validations)
 * Copyright (c) ${year} Geremia Taglialatela, Brian Cardarella
 * Licensed under MIT (https://opensource.org/licenses/mit-license.php)
 */
`

const fixBanner = (file) => {
  const content = fs.readFileSync(file, 'utf8')
  const fixed = content.replace(/^\/\*![\s\S]*?\*\/\n/, (match) =>
    match.replace(/\n(?! )\*/g, '\n *'),
  )
  fs.writeFileSync(file, fixed)
}

const bannerPlugin = {
  name: 'banner',
  writeBundle(options, _bundle) {
    fixBanner(options.file)
  },
}

const copyToVendor = {
  name: 'copy-to-vendor',
  writeBundle() {
    fs.cpSync(pkg.main, 'vendor/assets/javascripts/rails.validations.js')
  },
}

export default [
  defineConfig({
    input: 'src/index.js',
    output: {
      file: pkg.main,
      banner,
      format: 'umd',
      name: 'ClientSideValidations',
    },
    platform: 'browser',
    plugins: [bannerPlugin, copyToVendor],
  }),
  defineConfig({
    input: 'src/index.js',
    output: {
      file: pkg.module,
      banner,
      format: 'es',
    },
    platform: 'browser',
    plugins: [bannerPlugin],
  }),
]

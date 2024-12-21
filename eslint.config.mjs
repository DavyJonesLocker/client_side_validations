import neostandard from 'neostandard'
import compat from 'eslint-plugin-compat'

export default [
  {
    ignores: [
      'coverage/*',
      'dist/*',
      'test/*',
      'vendor/*',
    ]
  },
  compat.configs['flat/recommended'],
  ...neostandard()
]

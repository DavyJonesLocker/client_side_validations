import neostandard from 'neostandard'

export default [
  {
    ignores: [
      'coverage/**/*.js',
      'dist/**/*.js',
      'test/**/*.js',
      'vendor/**/*.js',
    ]
  },
  ...neostandard()
]

import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/js/app.js',
  plugins: [
    buble()
  ],
  targets: [
    { dest: 'dist/js/app.js', format: 'es' }
  ]
}

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('cssnano')({
      discardComments: {
        removeAll: true
      }
    }),
    require('postcss-cssnext')
  ]
}

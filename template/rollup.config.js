import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/js/app.js',
  output: {
    name: 'app',
    file: 'dist/js/app.js',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    buble(),
    nodeResolve({ browser: true, jsnext: true, main: true }),
    commonjs()
  ]
}

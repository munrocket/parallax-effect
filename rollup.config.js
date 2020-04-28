
import pkg from './package.json';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'src/parallax-tracking.js',
    output: [
      { file: pkg.browser, name: 'ParallaxTracking', format: 'umd' },
      { file: pkg.module, name: 'ParallaxTracking', format: 'esm' }
    ],
    plugins: [
      builtins(),
      resolve()
    ]
  }
];
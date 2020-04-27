
import pkg from './package.json';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'src/parallax-effect.js',
    output: [
      { file: pkg.main, name: 'ParallaxEffect', format: 'umd' },
      { file: pkg.module, name: 'ParallaxEffect', format: 'esm' }
    ],
    plugins: [
      builtins(),
      resolve()
    ]
  }
];
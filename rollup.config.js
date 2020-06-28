
import pkg from './package.json';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';

export default [
  {
    input: 'src/parallax-effect.mjs',
    output: [
      { file: pkg.browser, name: 'Parallax', format: 'umd' },
      { file: pkg.module, name: 'Parallax', format: 'esm' }
    ],
    plugins: [
      builtins(),
      resolve(),
      cleanup()
    ]
  }
];
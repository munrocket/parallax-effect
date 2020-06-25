
import pkg from './package.json';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'src/parallax-view.mjs',
    output: [
      { file: pkg.browser, name: 'Parallax', format: 'umd' },
      { file: pkg.module, name: 'Parallax', format: 'esm' }
    ],
    plugins: [
      builtins(),
      resolve()
    ]
  }
];
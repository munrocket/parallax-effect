
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

const tsconfig = {
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outDir": "./dist",
    "sourceMap": false,
    "declaration": true,
    "lib": ["es2018"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}

export default [
  {
    input: 'src/parallax-effect.ts',
    output: [
      { file: pkg.main, name: 'Double', format: 'umd' },
      { file: pkg.module, name: 'Double', format: 'esm' },
    ],
    plugins: [ typescript({ tsconfigOverride: tsconfig }) ]
  }
];
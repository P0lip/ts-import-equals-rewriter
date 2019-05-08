import babel from 'rollup-plugin-babel';
import shebang from 'rollup-plugin-add-shebang';
import pkg from './package.json';

export default {
  input: './src/index.js',
  output: {
    file: './bin/index.js',
    format: 'cjs',
    name: pkg.name,
    sourcemap: false,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      externalHelpers: true,
    }),
    shebang({
      include: 'bin/index.js',
    }),
  ],
  external: [...Object.keys(pkg.dependencies), 'path', 'vm', 'util', 'fs'],
  acorn: {
    allowReserved: true,
    ecmaVersion: 9,
  },
};

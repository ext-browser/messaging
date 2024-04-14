import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';

const isDevelopment = process.env.BUILD === 'development';

let outputs = [
  {
    file: 'dist/index.cjs.js',
    format: 'cjs',
  },
  {
    file: 'dist/index.esm.js',
    format: 'esm',
  },
];

const dirs = ['background', 'content', 'popup', 'sidepanel', 'devtools'];

outputs.push(
  ...dirs.map((dir) => {
    return [
      {
        file: `dist/${dir}/index.cjs.js`,
        format: 'cjs',
      },
      {
        file: `dist/${dir}/index.esm.js`,
        format: 'esm',
      },
    ];
  }),
);

outputs = outputs.flat();

const plugins = [babel({ babelHelpers: 'bundled' })];

if (!isDevelopment) {
  plugins.push(terser());
}

export default {
  input: 'src/index.js',
  output: outputs,
  plugins,
};

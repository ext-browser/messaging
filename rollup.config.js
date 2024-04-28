import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";

const isDevelopment = process.env.BUILD === "development";

const prodPlugins = [babel({ babelHelpers: "bundled" }), terser()];
const devPlugins = [babel({ babelHelpers: "bundled", sourceMaps: true })];

export default {
  input: {
    index: "src/index.js",
    "background/index": "src/background/index.js",
    "content/index": "src/content/index.js",
    "popup/index": "src/popup/index.js",
    "sidepanel/index": "src/sidepanel/index.js",
    "devtools/index": "src/devtools/index.js",
    "contentWindow/index": "src/contentWindow/index.js",
  },
  output: [
    {
      format: "es",
      dir: "dist",
      entryFileNames: '[name].esm.js',
      sourcemap: isDevelopment,
    },
    {
      format: "cjs",
      dir: "dist",
      entryFileNames: '[name].cjs.js',
      sourcemap: isDevelopment,
    },
  ],
  // plugins: isDevelopment ? devPlugins : prodPlugins,
};

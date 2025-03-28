const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const postcss = require("rollup-plugin-postcss");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "PElementShared",
    },
    {
      file: "dist/index.esm.js",
      format: "es",
    },
  ],
  plugins: [
    resolve(),
    typescript({
      tsconfig: "../../tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
    }),
    postcss({
      extract: false,
      modules: false,
      use: ["sass"],
    }),
  ],
};

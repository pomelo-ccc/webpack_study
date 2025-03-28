const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const postcss = require("rollup-plugin-postcss");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "PElementButton",
      globals: {
        "@p-element/shared": "PElementShared",
      },
    },
    {
      file: "dist/index.esm.js",
      format: "es",
    },
  ],
  external: ["@p-element/shared"],
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

// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import htmlPlugin from "./src/plugins/html-plugin.js";

export default {
  input: "src/main-app.js",
  output: {
    dir: "public",
    format: "es",
    entryFileNames: "js/[name]-[hash].js",
    chunkFileNames: "js/chunks/[name]-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
    manualChunks: {
      // 将第三方依赖抽离到单独chunk
      vendor: [], // 当有外部依赖时添加到此数组
    },
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    css({
      output: "css/styles.css",
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
      ],
    }),
    terser({
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    }),
    htmlPlugin(),
  ],
  watch: {
    clearScreen: false,
    include: "src/**",
  },
};

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

// 判断是否为开发模式
const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'MyLibrary',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),

    dev && serve({
      open: false, // 自动打开浏览器
      contentBase: '.', // 服务根目录
      port: 3000
    }),
    dev && livereload('dist')
  ]
};
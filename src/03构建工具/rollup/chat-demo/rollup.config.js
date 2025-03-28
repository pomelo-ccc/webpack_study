// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/chat-client.js',
  output: {
    file: 'public/chat-client.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve()
  ],
  watch: {
    clearScreen: false,
    include: 'src/**'
  }
};
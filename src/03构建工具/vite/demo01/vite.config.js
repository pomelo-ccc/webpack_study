import { defineConfig } from 'vite'
import {visualizer} from 'rollup-plugin-visualizer'
import timestampPlugin from './src/plugins/vite-timestamp'
export default defineConfig({
  server: {
    port: 3000,       
    open: true,        
    hmr: true        
  },
  

  build: {
    outDir: 'dist',    
    minify: 'terser',  
    sourcemap: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }   
  },
  

  resolve: { 
      '@': '/src'
    }
  ,
  
  plugins: [
    visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
    }),
    timestampPlugin()      
  ]          
})

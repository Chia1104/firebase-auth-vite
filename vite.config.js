import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
            vue(),
            mkcert(),
            chunkSplitPlugin()
            ],
  server: {
    host: true,
    port: 5000, 
    https: true,
    open: '/',
    // open: '/race/test1',
  },
  build: {
    rollupOptions: {
      output: {
        // preserveModules: true,
        // preserveEntrySignatures: true
      }
      // https://rollupjs.org/configuration-options/
    }
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },

  plugins: [
    vue(),
    vueDevTools(),
    createHtmlPlugin(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/shared/api'),
      '@store': path.resolve(__dirname, 'src/shared/store'),
      '@assets': path.resolve(__dirname, 'src/shared/assets'),
    },
  },
})

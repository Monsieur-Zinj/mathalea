import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/alea/',
  build: {
    target: 'es2015',
    sourcemap: 'inline'
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: true
      }
    })
  ]
})

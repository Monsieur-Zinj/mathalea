import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/alea/',
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    sourcemap: true
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: true
      }
    })
  ]
})

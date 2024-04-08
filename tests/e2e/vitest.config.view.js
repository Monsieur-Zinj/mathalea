import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
import { resolve } from 'node:path'

export default mergeConfig(viteConfig, defineConfig({
  resolve: {
    alias: {
      testBrowser: resolve(__dirname, 'e2e')
    }
  },
  test: {
    include: ['./tests/view/*.test.{js,ts}'],
    hookTimeout: 600_000,
    testTimeout: 20000_000,
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
}))

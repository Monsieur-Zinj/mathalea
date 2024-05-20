import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
import { resolve } from 'node:path'

const arg = process.argv[2]

console.log('Running consistency test with', arg)

export default mergeConfig(viteConfig, defineConfig({
  resolve: {
    alias: {
      testBrowser: resolve(__dirname, 'e2e')
    }
  },
  test: {
    include: ['./tests/consistency/consistency.test.{js,ts}'],
    hookTimeout: 600_000,
    testTimeout: 200_000,
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
}))

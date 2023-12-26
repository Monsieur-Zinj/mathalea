// une config particulière pour vitest, pour lancer les test/**/*.longtest.js
// cf https://vitest.dev/config/

import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: ['./tests/interactivity/*.test.{js,ts}', './tests/console_errors/*.test.{js,ts}'],
    exclude: ['./tests/interactivity/mathLive.moule.test.ts'],
    // lui sert pour un délai un peu long dans un before
    hookTimeout: 20_000,
    // et lui pour chaque test
    testTimeout: 20_000
  }
}))

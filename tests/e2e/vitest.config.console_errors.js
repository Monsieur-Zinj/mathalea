// une config particulière pour vitest, pour lancer les test/**/*.longtest.js
// cf https://vitest.dev/config/

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
    include: ['./tests/console_errors/*.test.{js,ts}'],
    exclude: ['./tests/pdfexports/pdfexport.moule.test.ts'],
    // on veut laisser le navigateur ouvert sur un plantage (10min)
    hookTimeout: 600_000,
    testTimeout: 20000_000,
    // describe.sequential() ne fonctionne que dans un describe.concurrent()
    // cf https://vitest.dev/api/#describe-sequential
    // pour lancer tous les tests en séquentiel, il faut préciser singleThread ou singleFork
    // https://vitest.dev/config/#pooloptions-threads-singlethread
    // https://vitest.dev/config/#pooloptions-forks-singlefork
    // mais l'un comme l'autre font planter le lancement des tests dans webstorm avec
    // CACError: Unknown option `--threads`
    // (une erreur lancée par vite quand il est wrappé par webstorm)
    // Cette option est indispensable pour s'arrêter sur le premier test qui plante
    // (sinon vitest lance plusieurs playwright donc plusieurs fenêtres de navigateur,
    // et si un test s'arrête dans l'une les autres continuent de tourner rendant impossible
    // l'inspection du pb)
    // on le laisse et tant pis pour le wrap des tests dans webstorm
    reporters: ['html', 'default'],
    outputFile: {
      html: './logs/testconsole.html'
    },
    poolOptions: {
      threads: {
        singleThread: true
      }
      // forks: {
      //   singleFork: true
      // }
    }
  }
}))

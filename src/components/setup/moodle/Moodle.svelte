<script lang="ts">
  import { exercicesParams, darkMode } from '../../../lib/stores/generalStore'
  import Footer from '../../Footer.svelte'
  import NavBar from '../../shared/header/NavBar.svelte'
  import { mathaleaGetExercicesFromParams, mathaleaUpdateExercicesParamsFromUrl } from '../../../lib/mathalea.js'
  import type TypeExercice from '../../../exercices/Exercice'
  import ButtonToggleAlt from '../../shared/forms/ButtonToggleAlt.svelte'
  import { referentielLocale } from '../../../lib/stores/languagesStore'

  const copyCode = async () => {
    const preElt = document.querySelector('pre')
    if (preElt) {
      try {
        const text = preElt.innerText
        await navigator.clipboard.writeText(text)
      } catch (err) {
        console.error('Accès au presse-papier impossible: ', err)
      }
    } else {
      throw new Error("Can't find `pre` selector in document")
    }
  }

  function downloadCode () {
    const preElt = document.querySelector('pre')
    if (preElt) {
      const text = preElt.innerText
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', 'mathalea-gift.txt')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } else {
      throw new Error("Can't find `pre` selector in document")
    }
  }

  let content = ''
  let exercices: TypeExercice[]

  async function initExercices () {
    content = ''
    mathaleaUpdateExercicesParamsFromUrl()
    exercices = await mathaleaGetExercicesFromParams($exercicesParams)
    let i = 0
    for (const param of $exercicesParams) {
      let paramUrl = ''
      for (const key of Object.keys(param)) {
        if (key === 'sup') {
          paramUrl += `s\\=${param[key]}&`
        } else if (key === 'sup2') {
          paramUrl += `s2\\=${param[key]}&`
        } else if (key === 'sup3') {
          paramUrl += `s3\\=${param[key]}&`
        } else if (key === 'sup4') {
          paramUrl += `s4\\=${param[key]}&`
        } else if (key === 'nbQuestions') {
          paramUrl += `n\\=${param[key]}&`
        } else if (key !== 'alea' && key !== 'id') {
          paramUrl += `${key}\\=${param[key]}&`
        }
      }
      paramUrl = paramUrl.slice(0, -1)
      const graine = useAlea ? '' : `graine\\="${param.alea}" `
      content += `:: ${param.id} - ${exercices[i].titre} - ${exercices[i].nbQuestions} ${exercices[i].nbQuestions > 1 ? 'questions' : 'question'} ::\n`
      content += '<script src\\="https\\:\/\/coopmaths.fr\/alea\/assets\/externalJs\/moodle.js" type\\="module"><\/script>\n'
      content += `<mathalea-moodle url\\="${paramUrl}" ${graine}/>\n`
      content += '{\n'
      content += '=%100%100|*=%90%90|*=%80%80|*=%75%75|*=%66.66667%66.666|*=%60%60|*=%50%50|*=%40%40|*=%33.33333%33.333|*=%30%30|*=%25%25|*=%20%20|*=%16.66667%16.666|*=%14.28571%14.2857|*=%12.5%12.5|*=%11.11111%11.111|*=%10%10|*=%5%5|*=%0%0|*\n'
      content += '####<script src\\="https\\:\/\/coopmaths.fr\/alea\/assets\/externalJs\/moodle.js" type\\="module"><\/script>\n'
      content += `<mathalea-moodle url\\="${paramUrl}" ${graine}correction />\n`
      content += '}\n\n'
      i++
    }
  }
  let useAlea = true
  $: {
    useAlea
    initExercices()
  }

</script>

<main class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive ? 'dark' : ''}">
  <NavBar subtitle="Moodle" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale} />

  <section class="px-4 py-0 md:py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <h1 class="mt-12 mb-4 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Comment l'utiliser ?</h1>

    <p class="text-coopmaths-corpus dark:text-coopmathsdark-corpus text-lg md:text-xl">
      MathALÉA vous permet de créer un fichier au format gift que vous pourrez ensuite importer dans la banque de questions de votre plateforme Moodle. Vous trouverez de plus amples informations dans
      notre <a
        href="https://github.com/mathalea/mathalea/wiki/Utilisation-de-Mathalea-avec-Moodle"
        target="_blank"
        rel="noopener noreferrer"
        class="text-coopmaths-action dark:text-coopmathsdark-action">documentation</a
      >.
    </p>
    <h1 class="mt-12 mb-4 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Exportation</h1>

    <div class="flex flex-col justify-center items-center space-y-2">
      <div class="pl-4 pt-4">
        <ButtonToggleAlt
            title={'Utiliser des exercices aléatoires'}
            bind:value={useAlea}
            explanations={[
              'Chaque élève aura des exercices différents.',
              'Tous les élèves auront le même exercice'
            ]}
          />
      </div>

      <button
        type="submit"
        on:click={downloadCode}
        class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
      >
        <i class="bx bx-download mr-2" />Télécharger le fichier gift
      </button>
    </div>
    <!-- <button
        on:click={copyCode}
        class="p-2 rounded-xl text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
      >
      Copier le code
      </button> -->

    <h1 class="mt-12 md:mt-8 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-2xl md:text-4xl font-bold">Code</h1>
    <pre class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">{content}
  </pre>
  </section>
  <footer>
    <Footer />
  </footer>
</main>

<style>
  footer {
    margin-top: auto;
  }
</style>

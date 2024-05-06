<script lang="ts">
  import { creerDocumentAmc } from '../../../lib/amc/creerDocumentAmc.js'
  import { context } from '../../../modules/context.js'
  import {
    mathaleaGetExercicesFromParams,
    mathaleaHandleExerciceSimple,
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaGenerateSeed,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea.js'
  import Footer from '../../Footer.svelte'
  import { darkMode, exercicesParams } from '../../../lib/stores/generalStore.js'
  import type TypeExercice from '../../../exercices/Exercice'
  import FormRadio from '../../shared/forms/FormRadio.svelte'
  import NavBar from '../../shared/header/NavBar.svelte'
  import ModalActionWithDialog from '../../shared/modal/ModalActionWithDialog.svelte'
  import { showDialogForLimitedTime } from '../../../lib/components/dialogs.js'
  import seedrandom from 'seedrandom'
  import Button from '../../shared/forms/Button.svelte'
  import ModalMessageBeforeAction from '../../shared/modal/ModalMessageBeforeAction.svelte'
  import { onMount } from 'svelte'
  import { referentielLocale } from '../../../lib/stores/languagesStore.js'

  const isSettingsVisible: boolean[] = []
  let exercices: TypeExercice[] = []
  let content = ''
  let entete = 'AMCcodeGrid'
  let format = 'A4'
  let matiere = ''
  let titre = ''
  const nbQuestionsModif: number[] = []
  const exercicesARetirer: string[] = []
  let refsExercicesARetirer: string[]
  $: refsExercicesARetirer = []

  type NbQuestionsIndexees = {
    indexExercice: number
    nombre: number
  }

  let nbQuestions: Array<NbQuestionsIndexees> = []
  let nbExemplaires = 1
  let textForOverleaf: HTMLInputElement

  async function initExercices () {
    exercicesARetirer.length = 0
    await mathaleaUpdateExercicesParamsFromUrl()
    exercices = await mathaleaGetExercicesFromParams($exercicesParams)
    for (const exercice of exercices) {
      isSettingsVisible.push(false)
      context.isHtml = false
      context.isAmc = true
      seedrandom(exercice.seed, { global: true })
      if (exercice.typeExercice === 'simple') {
        mathaleaHandleExerciceSimple(exercice, false)
      } else {
        if (exercice.nouvelleVersionWrapper != null) exercice.nouvelleVersionWrapper()
      }
      if (exercice.amcType == null) {
        // l'exercice n'est pas disponible AMC
        exercicesARetirer.push(exercice.uuid)
        if (exercice.id != null) {
          refsExercicesARetirer.push(exercice.id)
        } else {
          const proprietes: string[] = Object.values(exercice)
          proprietes.shift()
          refsExercicesARetirer.push(proprietes.join(' '))
        }
      }
    }
    exercices = exercices.filter(
      (exercice) => !exercicesARetirer.includes(exercice.uuid)
    )

    refsExercicesARetirer = refsExercicesARetirer
    // afficher le modal pour les exercices non AMC ?
    if (refsExercicesARetirer.length !== 0) {
      nonAmcModal.style.display = 'block'
    } else {
      nonAmcModal.style.display = 'none'
    }
  }

  initExercices()

  $: {
    // ToDo vérifier la saisie utilisateur
    // Si les copies sont préremplies, c'est un seul exemplaire pour ne pas avoir plusieurs sujets avec le même nom
    if (entete === 'AMCassociation') nbExemplaires = 1
    // On récupère les nombres de questions par groupe indexé sur l'index d'exercice dans exercices
    // la ligne suivante lève une erreur
    // nbQuestions = nbQuestionsModif.map((elt, i) => {
    //   if (elt !== null) return { indexExercice: i, nombre: elt }
    // })
    // on la remplace par une boucle classique
    nbQuestions.length = 0
    for (let i = 0; i < nbQuestionsModif.length; i++) {
      nbQuestions.push({ indexExercice: i, nombre: nbQuestionsModif[i] })
    }
    nbQuestions = nbQuestions
    // on blinde le nbExemplaires qui ne peut être 0 ou undefined
    if (nbExemplaires == null) nbExemplaires = 1
    for (let i = 0; i < exercices.length; i++) {
      const exo = exercices[i]
      const nbQ = nbQuestions.find((elt, i) => elt.indexExercice === i)
      if (nbQ != null) {
        if (exo.nbQuestions < nbQ.nombre) {
          exo.nbQuestions = nbQ.nombre * nbExemplaires
          context.isHtml = false
          context.isAmc = true
          seedrandom(exo.seed, { global: true })
          if (exo.typeExercice === 'simple') {
            mathaleaHandleExerciceSimple(exo, false)
          } else {
            if (exo.nouvelleVersionWrapper != null) exo.nouvelleVersionWrapper()
          }
        }
      }
    }
    content = creerDocumentAmc({
      exercices,
      typeEntete: entete,
      format,
      matiere,
      titre,
      nbQuestions: nbQuestions.map((elt) => elt.nombre),
      nbExemplaires
    })
  }

  /**
   * Copier le code LaTeX dans le presse-papier
   * @param {string} dialogId id attaché au composant
   * @author sylvain
   */
  async function copyLaTeXCodeToClipBoard (dialogId: string) {
    navigator.clipboard.writeText(content).then(
      () => {
        showDialogForLimitedTime(dialogId + '-1', 1000)
      },
      (err) => {
        console.error('Async: Could not copy text: ', err)
        showDialogForLimitedTime(dialogId + '-2', 1000)
      }
    )
  }

  /* =======================================================
   *
   * Mécanismes de gestion du modal d'infos sur OverLeaf
   *
   */
  let modal: HTMLElement
  let overleafForm: HTMLFormElement
  let nonAmcModal: HTMLElement
  // $: isNonAmcModal Visible = false
  onMount(async () => {
    modal = document.getElementById('overleaf-modal') as HTMLElement
    overleafForm = document.getElementById('overleaf-form') as HTMLFormElement
    nonAmcModal = document.getElementById('nonAmc-modal') as HTMLElement
  })
  // click en dehors du modal le fait disparaître
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
    if (event.target === nonAmcModal) {
      nonAmcModal.style.display = 'none'
    }
  }

  function handleNonAmcModal () {
    nonAmcModal.style.display = 'none'
  }

  /**
   * Gérer le POST pour Overleaf
   */
  function handleOverLeaf () {
    textForOverleaf.value =
      'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(content)))
    overleafForm.submit()
    modal.style.display = 'none'
  }

  // =======================================================
</script>

<main
  class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {$darkMode.isActive
    ? 'dark'
    : ''}"
>
  <NavBar subtitle="AMC" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale} />

  <section class="px-10 py-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div
      class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10"
    >
      <div>
        <div
          class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
        >
          Type d'entête
        </div>
        <FormRadio
          bind:valueSelected={entete}
          labelsValues={[
            { label: 'Grille de codage', value: 'AMCcodeGrid' },
            { label: 'Copies pré-remplies', value: 'AMCassociation' },
            { label: 'Noms et prénoms manuscrits', value: 'manuscrits' }
          ]}
          title="entete"
        />
      </div>
      <div>
        <div
          class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
        >
          Format
        </div>
        <FormRadio
          bind:valueSelected={format}
          labelsValues={[
            { label: 'Format A4 portrait', value: 'A4' },
            { label: 'Format A3 paysage 2 colonnes', value: 'A3' }
          ]}
          title="format"
        />
      </div>
    </div>
    <div
      class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10"
    >
      <div>
        <div
          class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
        >
          Matière
        </div>
        <input
          bind:value={matiere}
          id="amc-export-matiere-input"
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          type="text"
        />
      </div>
      <div>
        <div
          class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
        >
          Titre
        </div>
        <input
          bind:value={titre}
          id="amc-export-titre-input"
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          type="text"
        />
      </div>
      <div>
        <div
          class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
        >
          Nombre de questions par groupe
        </div>
        {#each exercices as exercice, i}
          <div>
            {exercice.id}{exercice.sup
              ? `-S:${exercice.sup}`
              : ''}{exercice.sup2 ? `-S2:${exercice.sup2}` : ''}{exercice.sup3
                ? `-S3:${exercice.sup3}`
                : ''}
            <input
              type="text"
              id="amc-export-nb-questions-gr{i}-input"
              class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
              placeholder={exercice.nbQuestions.toString()}
              bind:value={nbQuestionsModif[i]}
            />
            <span>{exercice.amcType ? exercice.amcType : 'not amcReady'}</span>
            <button
              class="mx-2 tooltip tooltip-left"
              data-tip="Nouvel énoncé"
              id="amc-export-new-enonce-button"
              type="button"
              on:click={() => {
                exercice.seed = mathaleaGenerateSeed()
                seedrandom(exercice.seed, { global: true })
                if (exercice.nouvelleVersionWrapper != null) exercice.nouvelleVersionWrapper()
                $exercicesParams[i].alea = exercice.seed
                mathaleaUpdateUrlFromExercicesParams()
              }}
              ><i
                class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-refresh"
              />
            </button>
            <!-- <button
               class="tooltip tooltip-left tooltip-neutral"
               data-tip="Changer les paramètres de l'exercice"
               type="button"
               on:click={() => {
    isSettingsVisible[i] = !isSettingsVisible[i]
  }}
             >
               <i
                 class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx {isSettingsVisible
        ? 'bxs-cog'
        : 'bx-cog'}"
               />
             </button>
            <div class="{isSettingsVisible[i] ? 'flex': 'hidden'} flex-col ...">
              <SettingsAmc {exercice}/>
            </div>
                         -->
          </div>
        {/each}
        <div>
          <ModalMessageBeforeAction
            modalButtonTitle="Continuer"
            icon="bxs-error"
            classForButton="px-2 py-1 rounded-md"
            modalId="nonAmc-modal"
            on:action={handleNonAmcModal}
          >
            <span slot="header" />
            <div slot="content" class="text-justify">
              Les exercices suivants n'ayant pas de version AMC, ils ont été
              retirés de la liste.
              <ul class="list-inside list-disc text-left text-base mt-1">
                {#each refsExercicesARetirer as reference}
                  <li>{reference}</li>
                {/each}
              </ul>
            </div>
          </ModalMessageBeforeAction>
        </div>
      </div>
      <div>
        <div
          class="pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
        >
          Nombre d'exemplaires distincts
        </div>
        <input
          bind:value={nbExemplaires}
          class="ml-4 md:ml-0 border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-sm text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light"
          min="1"
          type="number"
        />
      </div>
    </div>

    <div
      class="flex flex-col md:flex-row justify-start items-start my-4 space-y-5 md:space-y-0 md:space-x-10 mt-8"
    >
      <ModalActionWithDialog
        dialogId="latexCopy"
        classForButton="px-2 py-1 rounded-md"
        message="Le code LaTeX a été copié dans le presse-papier"
        messageError="Impossible de copier le code dans le presse-papier !"
        on:display={() => {
          copyLaTeXCodeToClipBoard('latexCopy')
        }}
        title="Copier le code LaTeX"
      />
      <Button
        class="px-2 py-1 rounded-md"
        idLabel="open-btn"
        on:click={() => {
          modal.style.display = 'block'
        }}
        title="Compiler sur OverLeaf"
      />
    </div>
    <pre
      class="my-10 shadow-md bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus dark:text-coopmathsdark-corpus p-4 w-full overflow-auto">
      {content}
    </pre>
  </section>
  <!-- Message avant envoi sur Overleaf -->
  <ModalMessageBeforeAction
    modalButtonTitle="Continuer"
    classForButton="px-2 py-1 rounded-md"
    icon="bxs-error"
    modalId="overleaf-modal"
    on:action={handleOverLeaf}
  >
    <span slot="header">Attention !</span>
    <ul class="list-inside list-disc text-left text-base" slot="content">
      <li>Le fichier sortit d’Overleaf ne constitue qu’un aperçu.</li>
      <li>
        Le fichier doit être compilé sous AMC impérativement pour que le fichier
        soit fonctionnel.
      </li>
    </ul>
  </ModalMessageBeforeAction>
  <!-- Formulaire pour Overleaf -->
  <form
    action="https://www.overleaf.com/docs"
    id="overleaf-form"
    method="POST"
    target="_blank"
  >
    <input
      type="hidden"
      name="snip_uri[]"
      value="https://coopmaths.fr/alea/static/amc/automultiplechoice.sty"
      autocomplete="off"
    />
    <input
      type="hidden"
      name="snip_name[]"
      value="automultiplechoice.sty"
      autocomplete="off"
    />
    <input
      autocomplete="off"
      bind:this={textForOverleaf}
      name="snip_uri[]"
      type="hidden"
      value=""
    />
    <input
      autocomplete="off"
      name="snip_name[]"
      type="hidden"
      value="coopmaths.tex"
    />
    <input autocomplete="off" name="engine" type="hidden" value="lualatex" />
  </form>
  <Footer />
</main>

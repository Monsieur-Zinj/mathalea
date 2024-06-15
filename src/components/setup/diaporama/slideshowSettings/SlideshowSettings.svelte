<script lang="ts">
  import {
    mathaleaHandleComponentChange
  } from '../../../../lib/mathalea'
  import {
    questionsOrder,
    selectedExercises,
    transitionsBetweenQuestions
  } from '../../../../lib/stores/generalStore'
  import type Exercice from '../../../../exercices/Exercice'
  import ModalActionWithDialog from '../../../shared/modal/ModalActionWithDialog.svelte'
  import { copyLinkToClipboard } from '../../../../lib/components/clipboard'
  import ModalForQRCode from '../../../shared/modal/ModalForQRCode.svelte'
  import FormRadio from '../../../shared/forms/FormRadio.svelte'
  import ButtonToggle from '../../../shared/forms/ButtonToggle.svelte'
  import NavBar from '../../../shared/header/NavBar.svelte'
  import FullscreenButton from '../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'
  import { buildMathAleaURL } from '../../../../lib/components/urls'
  import { referentielLocale } from '../../../../lib/stores/languagesStore'

  export let exercices: Exercice[]
  export let stringNbOfVues: string
  export let stringDureeTotale: string
  export let isManualModeActive: boolean
  export let isSameDurationForAll: boolean
  export let durationGlobal: number | undefined
  export let currentQuestion: number
  export let QRCodeWidth: number
  export let formatQRCodeIndex: 0 | 1 | 2
  export let updateExercices: () => void
  export let handleCheckManualMode: () => void
  export let handleCheckSameDurationForAll: () => void
  export let labelsForMultivue: { label: string; value: string | number; isDisabled?: boolean | undefined; }[]
  export let labelsForSounds: { label: string; value: string | number; isDisabled?: boolean | undefined; }[]
  export let handleTuneChange: () => void
  export let handleRandomQuestionOrder: () => void
  export let handleSampleChecked: () => void
  export let handleSampleSizeChange: () => void
  export let handleTransitionsMode: () => void
  export let handleTransitionSound: () => void
  export let handleChangeDurationGlobal: () => void
  export let goToQuestion: (index: number) => void
  export let timer: (duration: number) => void
  export let getTotalNbOfQuestions: () => number
  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }
  export let divTableDurationsQuestions: HTMLDivElement
  export let durations: number[]

</script>

<div
id="start"
class="flex flex-col h-screen scrollbar-hide bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus"
>
<!-- <div class="flex flex-row justify-between p-6">
  <div class="text-4xl text-coopmaths-struct font-bold">Réglages du Diaporama</div>
  <button type="button">
    <i
      class="relative bx ml-2 bx-lg bx-x text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
      on:click={() => mathaleaHandleComponentChange("diaporama", "")}
      on:keydown={() => mathaleaHandleComponentChange("diaporama", "")}
    />
  </button>
</div> -->
<NavBar subtitle="Réglages du diaporama" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale} />
<div class="flex flex-row w-full justify-center items-start mx-20 mt-10">
  <!-- Multivue + Liens -->
  <div class="flex flex-col w-1/5 justify-start">
    <div class="flex flex-row justify-start items-center pb-6">
      <div
        class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        Aperçu
        <div class="flex flex-row px-4 justify-start">
          <div
            class="tooltip tooltip-bottom tooltip-neutral"
            data-tip="Aperçu des questions/réponses"
          >
            <button
              type="button"
              id="diaporama-apercu"
              class="mr-4 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
              on:click={() => {
                mathaleaHandleComponentChange('diaporama', 'overview')
              }}
            >
              <i class="bx text-2xl bx-detail" />
            </button>
          </div>
        </div>
      </div>
      <FullscreenButton/>
    </div>
    <div
      class="flex text-lg font-bold mb-2 text-coopmaths-struct dark:text-coopmathsdark-struct"
    >
      Multivue
    </div>
    <div class="flex px-4 pb-8">
      <FormRadio
        bind:valueSelected={stringNbOfVues}
        on:newvalue={updateExercices}
        title="multivue"
        labelsValues={labelsForMultivue}
      />
    </div>

    <div class="pb-8">
      <div
        class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        Transitions
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          id="diaporama-transition-toggle"
          bind:value={$transitionsBetweenQuestions.isQuestThenSolModeActive}
          titles={[
            'Question <em>puis</em> correction',
            'Question / Question+Correction / Correction'
          ]}
        />
      </div>
      <div
        class="{$transitionsBetweenQuestions.isQuestThenSolModeActive
          ? 'flex'
          : 'hidden'} flex-row justify-start items-center pr-4 pl-6"
      >
        <input
          id="checkbox-choice-8"
          aria-describedby="checkbox-choice"
          type="checkbox"
          class="w-4 h-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {!$transitionsBetweenQuestions.isQuestThenSolModeActive
            ? 'border-opacity-10'
            : 'border-opacity-100'} border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
          bind:checked={$transitionsBetweenQuestions.questThenQuestAndSolDisplay}
          disabled={!$transitionsBetweenQuestions.isQuestThenSolModeActive}
        />
        <label
          for="checkbox-choice-8"
          class="ml-3 text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus {!$transitionsBetweenQuestions.isQuestThenSolModeActive
            ? 'text-opacity-10 dark:text-opacity-10'
            : 'text-opacity-70 dark:text-opacity-70'}"
        >
          Afficher la question avec la correction
        </label>
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          id="diaporama-transition-correction-toggle"
          bind:value={$transitionsBetweenQuestions.isActive}
          titles={[
            'Carton entre questions',
            'Pas de carton entre questions'
          ]}
          on:toggle={handleTransitionsMode}
        />
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          id="diaporama-transition-sons-toggle"
          bind:value={$transitionsBetweenQuestions.isNoisy}
          titles={['Son entre questions', 'Pas de son entre questions']}
          on:toggle={handleTransitionSound}
        />
      </div>
      <FormRadio
        title="son"
        isDisabled={!$transitionsBetweenQuestions.isNoisy}
        bind:valueSelected={$transitionsBetweenQuestions.tune}
        labelsValues={labelsForSounds}
        orientation="row"
        on:newvalue={() => {
          transitionSounds[$transitionsBetweenQuestions.tune].play()
          handleTuneChange()
        }}
      />
    </div>
    <div class="pb-6">
      <div
        class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        Ordre
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <ButtonToggle
          id="diaporama-ordre-questions-toggle"
          bind:value={$questionsOrder.isQuestionsShuffled}
          titles={[
            'Questions dans le désordre',
            "Questions dans l'ordre"
          ]}
          on:toggle={handleRandomQuestionOrder}
        />
      </div>
    </div>
    <div class="pb-6">
      <div
        class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct
        {exercices.length === 1 ? 'text-opacity-20' : 'text-opacity-100'}"
      >
        Choix aléatoire
      </div>
      <div class="flex flex-row justify-start items-center px-4">
        <input
          id="checkbox-choice-6"
          aria-describedby="checkbox-choice"
          type="checkbox"
          class="w-4 h-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {exercices.length ===
          1
            ? 'border-opacity-10'
            : 'border-opacity-100'} border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
          checked={$selectedExercises.isActive}
          on:change={handleSampleChecked}
          disabled={exercices.length === 1}
        />
        <label
          for="checkbox-choice-6"
          class="ml-3 text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus {exercices.length ===
          1
            ? 'text-opacity-10 dark:text-opacity-10'
            : 'text-opacity-70 dark:text-opacity-70'}"
        >
          Seulement certains exercices de la liste
        </label>
      </div>
      <div class="pl-8">
        <input
          type="number"
          id="diaporama-nb-exos-dans-liste-input"
          min="1"
          max={exercices.length}
          bind:value={$selectedExercises.count}
          on:change={handleSampleSizeChange}
          class="ml-3 w-14 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-canvas-darkest focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-0"
          disabled={!$selectedExercises.isActive}
        />
        <span
          class="text-coopmaths-corpus dark:text-coopmathsdark-corpus {$selectedExercises.isActive
            ? 'text-opacity-100 dark:text-opacity-100'
            : 'text-opacity-0 dark:text-opacity-0'}"
        >
          parmi {exercices.length}</span
        >
      </div>
    </div>
    <div
      class="flex text-lg font-bold pb-2 text-coopmaths-struct dark:text-coopmathsdark-struct"
    >
      Liens
      <div class="flex flex-row px-4 -mt-2 justify-start">
        <ModalActionWithDialog
          on:display={() => copyLinkToClipboard('linkCopiedDialog-1', buildMathAleaURL('diaporama'))}
          message="Le lien est copié dans le presse-papier !"
          dialogId="linkCopiedDialog-1"
          tooltipMessage="Lien du Diaporama"
          classForButton="mr-4 my-2"
        />
        <ModalForQRCode
          classForButton="mr-4 my-2"
          dialogId="QRCodeModal-1"
          imageId="QRCodeCanvas-1"
          url={document.URL}
          tooltipMessage="QR-code du diaporama"
          width={QRCodeWidth}
          format={formatQRCodeIndex}
        />
      </div>
    </div>
  </div>
  <!-- Tableau réglages -->
  <div class="flex flex-col w-4/6 justify-start">
    <div
      class="flex flex-col lg:flex-row px-4 pb-4 w-full justify-start lg:justify-between lg:items-center"
    >
      <div
        class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        Durées et nombres de questions
      </div>
      <div class="flex items-center">
        <input
          id="diaporama-defilement-manuel-checkbox"
          aria-describedby="diaporama-defilement-manuel-checkbox"
          type="checkbox"
          checked={isManualModeActive}
          class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
          on:change={handleCheckManualMode}
        />
        <label
          for="diaporama-defilement-manuel-checkbox"
          class="ml-3 mr-4 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus"
        >
          Défilement manuel
        </label>
        <input
          id="diaporama-meme-duree-checkbox"
          aria-describedby="diaporama-meme-duree-checkbox"
          type="checkbox"
          class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action
          {exercices.length === 1 || isManualModeActive
            ? 'border-opacity-30 dark:border-opacity-30'
            : 'border-opacity-100 dark:border-opacity-100'} focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
          bind:checked={isSameDurationForAll}
          on:change={handleCheckSameDurationForAll}
          disabled={exercices.length === 1 || isManualModeActive}
        />
        <label
          for="diaporama-meme-duree-checkbox"
          class="ml-3 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus
          {exercices.length === 1 || isManualModeActive
            ? 'text-opacity-30 dark:text-opacity-30'
            : 'text-opacity-100 dark:text-opacity-100'} "
        >
          Même durée pour toutes les questions
          <input
            type="number"
            id="diaporama-meme-duree-input"
            min="1"
            on:change={handleChangeDurationGlobal}
            bind:value={durationGlobal}
            class="ml-3 w-20 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border {isSameDurationForAll
              ? ''
              : 'border-transparent'} border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
            disabled={!isSameDurationForAll || isManualModeActive}
          />
        </label>
      </div>
    </div>

    <div
      class="flex flex-col min-w-full h-[100vh] px-4 align-middle"
      bind:this={divTableDurationsQuestions}
    >
      <div
        class="table-wrp block shadow ring-1 ring-coopmaths-struct dark:ring-coopmathsdark-struct ring-opacity-10 dark:ring-opacity-20 md:rounded-lg"
      >
        <table
          class="table-fixed min-w-full divide-y divide-coopmaths-struct dark:divide-coopmathsdark-struct divide-opacity-10 dark:divide-opacity-20"
        >
          <thead
            class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark sticky top-0"
          >
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 w-4/6 text-left text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct sm:pl"
            >
              Exercices<span
                class="pl-2 font-extralight text-opacity-60 {$selectedExercises.isActive
                  ? ''
                  : 'invisible'}"
                >({$selectedExercises.count} parmi {exercices.length})</span
              >
            </th>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct"
            >
              <div class={isManualModeActive ? 'opacity-20' : ''}>
                Durées par question (s)
              </div>
              <div
                class=" text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs"
              >
                {#if !isManualModeActive}
                  Durée diapo :<span class="font-light ml-1"
                    >{stringDureeTotale}</span
                  >
                {:else}
                  <span class="font-light ml-1" />
                {/if}
              </div>
            </th>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct"
            >
              <div>Nombres de questions</div>
              <div
                class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs"
              >
                Total :<span class="font-light ml-1"
                  >{getTotalNbOfQuestions()}</span
                >
              </div>
            </th>
          </thead>
          <tbody class="overflow-y-auto" id="exercisesList">
            {#each exercices as exercice, i}
              <tr>
                <td
                  class="whitespace-normal px-3 py-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus"
                >
                  <span
                    class="{$selectedExercises.isActive &&
                    $selectedExercises.indexes.includes(i)
                      ? ''
                      : 'invisible'} pr-2"
                    ><i
                      class="bx text-xs bxs-circle text-coopmaths-warn-lightest dark:text-coopmathsdark-warn-lightest"
                    /></span
                  >
                  {exercice.id} - {exercice.titre}
                </td>
                <td class="whitespace-normal px-3 py-4 text-sm">
                  <span class="flex justify-center">
                    <input
                      type="number"
                      id="diaporama-exo-duration-{i}"
                      min="1"
                      on:change={updateExercices}
                      bind:value={exercice.duration}
                      class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 disabled:opacity-30"
                      disabled={isSameDurationForAll ||
                        isManualModeActive}
                    />
                  </span>
                </td>
                <td class="whitespace-normal px-3 py-4 text-sm">
                  <span class="flex justify-center">
                    <input
                      type="number"
                      id="diaporama-exo-nb-questions-{i}"
                      min="1"
                      bind:value={exercice.nbQuestions}
                      on:change={updateExercices}
                      class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0"
                    />
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="flex flex-row items-center justify-end w-full my-4">
        <button
          type="button"
          id="diaporama-play-button"
          class="animate-pulse inline-flex items-center justify-center shadow-2xl w-2/12 bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest font-extrabold text-coopmaths-canvas dark:text-coopmathsdark-canvas text-3xl py-4 rounded-lg"
          on:click={() => {
            goToQuestion(0)
            if (!isManualModeActive) {
              timer(durationGlobal ?? durations[currentQuestion] ?? 10)
            }
          }}
          on:keydown={() => {
            goToQuestion(0)
            if (!isManualModeActive) {
              timer(durationGlobal ?? durations[currentQuestion] ?? 10)
            }
          }}
        >
          Play<i class="bx bx-play" />
        </button>
      </div>
    </div>
  </div>
</div>
</div>

<style>
  .table-wrp {
    max-height: 60%;
    overflow-y: auto;
    display: block;
  }
  thead {
    position: sticky;
    top: 0;
  }
</style>

<script lang="ts">
  import type { TransitionsBetweenQuestions } from '../../types'
  import ButtonToggle from '../../../../shared/forms/ButtonToggle.svelte'
  import FormRadio from '../../../../shared/forms/FormRadio.svelte'

  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }
  export let transitionsBetweenQuestions: TransitionsBetweenQuestions
  export let updateTransition: (transitionsBetweenQuestions: TransitionsBetweenQuestions) => void

  const labelsForSounds = [
    { label: 'Son 1', value: '0' },
    { label: 'Son 2', value: '1' },
    { label: 'Son 3', value: '2' },
    { label: 'Son 4', value: '3' }
  ]

</script>

<div class="pb-8">
  <div class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct">
    Transitions
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-transition-toggle"
      bind:value={transitionsBetweenQuestions.isQuestThenSolModeActive}
      titles={[
        'Question <em>puis</em> correction',
        'Question / Question+Correction / Correction'
      ]}
    />
  </div>
  <div
    class="{transitionsBetweenQuestions.isQuestThenSolModeActive
      ? 'flex'
      : 'hidden'} flex-row justify-start items-center pr-4 pl-6"
  >
    <input
      id="checkbox-choice-8"
      aria-describedby="checkbox-choice"
      type="checkbox"
      class="w-4 h-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {!transitionsBetweenQuestions.isQuestThenSolModeActive
        ? 'border-opacity-10'
        : 'border-opacity-100'} border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
      bind:checked={transitionsBetweenQuestions.questThenQuestAndSolDisplay}
      disabled={!transitionsBetweenQuestions.isQuestThenSolModeActive}
    />
    <label
      for="checkbox-choice-8"
      class="ml-3 text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus {!transitionsBetweenQuestions.isQuestThenSolModeActive
        ? 'text-opacity-10 dark:text-opacity-10'
        : 'text-opacity-70 dark:text-opacity-70'}"
    >
      Afficher la question avec la correction
    </label>
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-transition-correction-toggle"
      bind:value={transitionsBetweenQuestions.isActive}
      titles={[
        'Carton entre questions',
        'Pas de carton entre questions'
      ]}
      on:toggle={() => updateTransition(transitionsBetweenQuestions)}
    />
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-transition-sons-toggle"
      bind:value={transitionsBetweenQuestions.isNoisy}
      titles={['Son entre questions', 'Pas de son entre questions']}
      on:toggle={() => updateTransition(transitionsBetweenQuestions)}
    />
  </div>
  <FormRadio
    title="son"
    isDisabled={!transitionsBetweenQuestions.isNoisy}
    bind:valueSelected={transitionsBetweenQuestions.tune}
    labelsValues={labelsForSounds}
    orientation="row"
    on:newvalue={() => {
      transitionSounds[transitionsBetweenQuestions.tune].play()
      updateTransition(transitionsBetweenQuestions)
    }}
  />
</div>

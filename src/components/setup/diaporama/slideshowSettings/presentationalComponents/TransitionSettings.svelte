<script lang="ts">
  import { isIntegerInRange0to3 } from '../../../../../lib/types/integerInRange'
  import ButtonToggle from '../../../../shared/forms/ButtonToggle.svelte'
  import FormRadio from '../../../../shared/forms/FormRadio.svelte'

  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }
  export let screenBetweenSlides: boolean
  export let sound: 0 | 1 | 2 | 3 | 4
  export let updateFlow: (flow: 0 | 1 | 2) => void
  export let updateScreenBetweenSlides: (screenBetweenSlides: boolean) => void
  export let updateTune: (tune: -1 | 0 | 1 | 2 | 3) => void
  export let questionThenCorrectionToggle: boolean
  export let questionWithCorrectionToggle: boolean

  const labelsForSounds = [
    { label: 'Son 1', value: 0 },
    { label: 'Son 2', value: 1 },
    { label: 'Son 3', value: 2 },
    { label: 'Son 4', value: 3 }
  ]

  let soundToggle = sound > 0

  const tuneCandidate = Math.max(sound - 1, 0)
  let tune: 0 | 1 | 2 | 3 = isIntegerInRange0to3(tuneCandidate) ? tuneCandidate : 0

</script>

<div class="pb-8">
  <div class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct">
    Transitions
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-transition-toggle"
      bind:value={questionThenCorrectionToggle}
      titles={[
        'Alterner questions et corrections',
        'Ne pas alterner questions et corrections'
      ]}
      on:toggle={() => updateFlow(questionThenCorrectionToggle ? 1 : 0)}
    />
  </div>
  <div
    class="{questionThenCorrectionToggle
      ? 'flex'
      : 'hidden'} flex-row justify-start items-center pr-4 pl-6"
  >
    <input
      id="checkbox-choice-8"
      aria-describedby="checkbox-choice"
      type="checkbox"
      class="w-4 h-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {!questionThenCorrectionToggle
        ? 'border-opacity-10'
        : 'border-opacity-100'} border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
      bind:checked={questionWithCorrectionToggle}
      disabled={!questionThenCorrectionToggle}
      on:change={() => updateFlow(questionWithCorrectionToggle ? 2 : 1)}
    />
    <label
      for="checkbox-choice-8"
      class="ml-3 text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus {!questionThenCorrectionToggle
        ? 'text-opacity-10 dark:text-opacity-10'
        : 'text-opacity-70 dark:text-opacity-70'}"
    >
      En gardant les questions affichées
    </label>
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-transition-correction-toggle"
      bind:value={screenBetweenSlides}
      titles={[
        'Afficher des cartons entre les questions',
        'Ne pas afficher de carton'
      ]}
      on:toggle={() => updateScreenBetweenSlides(screenBetweenSlides)}
    />
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <ButtonToggle
      id="diaporama-transition-sons-toggle"
      bind:value={soundToggle}
      titles={['Jouer un son entre les questions', 'Ne pas jouer de son entre les questions']}
      on:toggle={() => {
        if (soundToggle) {
          transitionSounds[tune].play()
          updateTune(tune)
        } else {
          updateTune(-1)
        }
      }}
    />
  </div>
  <FormRadio
    title="son"
    isDisabled={!soundToggle}
    bind:valueSelected={tune}
    labelsValues={labelsForSounds}
    orientation="row"
    on:newvalue={() => {
      transitionSounds[tune].play()
      updateTune(tune)
    }}
  />
</div>

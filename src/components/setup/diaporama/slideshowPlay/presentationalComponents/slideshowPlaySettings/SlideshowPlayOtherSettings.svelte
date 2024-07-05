<script lang="ts">
  import Button from '../../../../../shared/forms/Button.svelte'
  import SlideshowPlayTimerSettingsModal from './SlideshowPlayTimerSettingsModal.svelte'

  export let displayTimerSettingsModal: () => void
  export let switchPause: () => void
  export let handleTimerChange: (cursorTimeValue: number) => void
  export let switchCorrectionMode: () => void
  export let backToSettings: (event: Event) => void
  export let isManualModeActive: boolean | undefined
  export let isQuestionVisible: boolean
  export let isCorrectionVisible: boolean
  export let currentDuration: number

  $: getDisplayMode = () => {
    let displayMode = ''
    if (isQuestionVisible && !isCorrectionVisible) {
      displayMode = 'Q'
    }
    if (isQuestionVisible && isCorrectionVisible) {
      displayMode = 'Q+C'
    }
    if (!isQuestionVisible && isCorrectionVisible) {
      displayMode = 'C'
    }
    return displayMode
  }

</script>

<i
  class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-stopwatch"
  on:click={displayTimerSettingsModal}
  on:keydown={displayTimerSettingsModal}
  role="button"
  tabindex="0"
>
  <div class="absolute -bottom-[10px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths-struct dark:text-coopmathsdark-struct">
    {isManualModeActive ? 'Manuel' : currentDuration + 's'}
  </div>
</i>
<SlideshowPlayTimerSettingsModal
  {switchPause}
  {handleTimerChange}
/>
<button type="button" on:click={switchCorrectionMode}>
<i
  class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-show"
  title="Raccourci clavier : Entrée"
>
  <div class="absolute -bottom-[8px] left-1/2 -translate-x-1/2 text-sm font-extrabold font-sans">
    {getDisplayMode()}
  </div>
</i>
</button>
<Button
  icon="bx-power-off"
  class="ml-2 bx-sm md:bx-lg"
  title="Retour au paramétrage"
  on:click={backToSettings}
/>

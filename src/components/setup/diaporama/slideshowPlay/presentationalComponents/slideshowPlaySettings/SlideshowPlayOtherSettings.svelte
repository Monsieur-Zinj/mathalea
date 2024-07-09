<script lang="ts">
  import ButtonIcon from '../../../../../shared/forms/ButtonIcon.svelte'
  import SlideshowPlayTimerSettingsModal from './SlideshowPlayTimerSettingsModal.svelte'

  export let displayTimerSettingsModal: () => void
  export let hideTimerSettingsModal: () => void
  export let handleTimerChange: (cursorTimeValue: number) => void
  export let switchDisplayMode: () => void
  export let backToSettings: (event: Event) => void
  export let isManualModeActive: boolean | undefined
  export let isQuestionVisible: boolean
  export let isCorrectionVisible: boolean
  export let currentSlideDuration: number
  export let BUTTONS_CLASS: string

  $: getDisplayMode = () => {
    if (isQuestionVisible && !isCorrectionVisible) {
      return 'Q'
    }
    if (isQuestionVisible && isCorrectionVisible) {
      return 'Q+C'
    }
    if (!isQuestionVisible && isCorrectionVisible) {
      return 'C'
    }
    return ''
  }

</script>

<ButtonIcon
  icon="bx-stopwatch"
  buttonClass="{BUTTONS_CLASS}"
  title="Régler la durée de chaque question"
  floatUnderText={isManualModeActive ? 'Manuel' : currentSlideDuration + 's'}
  on:click={displayTimerSettingsModal}
/>
<ButtonIcon
  icon="bx-show"
  buttonClass="{BUTTONS_CLASS}"
  title="Raccourci clavier : Entrée"
  floatUnderText={getDisplayMode()}
  on:click={switchDisplayMode}
/>
<ButtonIcon
  icon="bx-power-off"
  buttonClass="{BUTTONS_CLASS}"
  title="Retour au paramétrage"
  on:click={backToSettings}
/>
<SlideshowPlayTimerSettingsModal
  {handleTimerChange}
  {hideTimerSettingsModal}
/>

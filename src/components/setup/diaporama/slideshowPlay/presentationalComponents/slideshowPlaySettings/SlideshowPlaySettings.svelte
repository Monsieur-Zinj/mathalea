<script lang="ts">
  import SlideshowPlayDisplaySettings from './SlideshowPlayDisplaySettings.svelte'
  import SlideshowPlayControlSettings from './SlideshowPlayControlSettings.svelte'
  import SlideshowPlayOtherSettings from './SlideshowPlayOtherSettings.svelte'

  export let flow: number | undefined
  export let isManualModeActive: boolean | undefined
  export let isQuestionVisible: boolean
  export let isCorrectionVisible: boolean
  export let handleTimerChange: (cursorTimeValue: number) => void
  export let backToSettings: (event: Event) => void
  export let isPause: boolean
  export let nextQuestion: () => void
  export let pause: () => void
  export let prevQuestion: () => void
  export let switchCorrectionMode: () => void
  export let switchPause: () => void
  export let zoomMinus: () => void
  export let zoomPlus: () => void
  export let currentDuration: number

  function displayTimerSettingsModal () {
    const modal = document.getElementById('timer-settings-modal')
    if (modal) {
      modal.style.display = 'block'
      pause()
    }
  }

</script>

<div class="flex flex-row justify-start items-center ml-10 w-[33%]">
  <SlideshowPlayDisplaySettings
    {zoomPlus}
    {zoomMinus}
  />
</div>
<div class="flex flex-row justify-center items-center w-[33%]">
  <SlideshowPlayControlSettings
    {flow}
    {isPause}
    {isManualModeActive}
    {prevQuestion}
    {nextQuestion}
    {switchPause}
  />
</div>
<div class="flex flex-row justify-end items-center mr-10 w-[33%]">
  <SlideshowPlayOtherSettings
    {displayTimerSettingsModal}
    {switchPause}
    {handleTimerChange}
    {switchCorrectionMode}
    {backToSettings}
    {isManualModeActive}
    {isQuestionVisible}
    {isCorrectionVisible}
    {currentDuration}
  />
</div>

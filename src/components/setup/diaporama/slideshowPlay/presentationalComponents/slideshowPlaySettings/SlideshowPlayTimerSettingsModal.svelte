<script lang="ts">
  import { setPhraseDuree } from '../../../../../../lib/components/time'
  import ModalMessageBeforeAction from '../../../../../shared/modal/ModalMessageBeforeAction.svelte'

  export let play: (isUserAction: boolean) => void
  export let handleTimerChange: (cursorTimeValue: number) => void

  let cursorTimeValue = 10
  let messageDuree: string
  $: messageDuree = setPhraseDuree(cursorTimeValue)

</script>

<ModalMessageBeforeAction
  modalId="timer-settings-modal"
  modalButtonId="timerSettings"
  modalButtonTitle="Fermer"
  icon="bx-stopwatch"
  classForButton="px-2 py-1 rounded-md text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
  on:action={() => {
    const modal = document.getElementById('timer-settings-modal')
    if (modal) {
      modal.style.display = 'none'
      play(true)
    }
  }}
>
  <h3 slot="header" class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct">
    Temps par question
  </h3>
  <div slot="content">
    <p class="py-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
      Régler la durée de projection en secondes
    </p>
    <div class="flew-row space-x-2">
      <div class="flex flex-row justify-start items-center space-x-2">
        <input
          class="w-1/4 h-2 bg-transparent text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
          type="range"
          max="30"
          min="0"
          name="duration"
          id="duration"
          bind:value={cursorTimeValue}
          on:change={() => handleTimerChange(cursorTimeValue)}
        />
        <label
          class="w-3/4 text-sm text-coopmaths-corpus"
          for="duration">{messageDuree}</label
        >
      </div>
    </div>
  </div>
</ModalMessageBeforeAction>

<script lang="ts">
  import RangeSlider from '../../../../../shared/forms/RangeSlider.svelte'
  import ModalMessageBeforeAction from '../../../../../shared/modal/ModalMessageBeforeAction.svelte'

  export let handleTimerChange: (cursorTimeValue: number) => void
  export let hideTimerSettingsModal: () => void

</script>

<ModalMessageBeforeAction
  modalId="timer-settings-modal"
  modalButtonId="timerSettings"
  modalButtonTitle="Fermer"
  icon="bx-stopwatch"
  classForButton="px-2 py-1 rounded-md text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
  on:action={hideTimerSettingsModal}
>
  <h3 slot="header" class="font-bold text-lg
    text-coopmaths-struc dark:text-coopmathsdark-struct"
  >
    Temps par question
  </h3>
  <div slot="content" class="flex flex-col justify-center">
    <p class="py-4
      text-coopmaths-corpus dark:text-coopmathsdark-corpus"
    >
      Régler la durée de projection en secondes
    </p>
    <div class="w-full px-8">
      <RangeSlider
        on:change={(e) => {
          const cursorTimeValue = e.detail
          handleTimerChange(cursorTimeValue)
        }}
      />
    </div>
  </div>
</ModalMessageBeforeAction>

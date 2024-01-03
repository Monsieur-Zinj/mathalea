<script lang="ts">
  import TwoStatesIcon from '../../../../../../../components/shared/icons/TwoStatesIcon.svelte'

  export let setFullScreen: (isFullScreen: boolean) => void

  let isFullScreen = false
</script>

<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip={isFullScreen
    ? 'Quitter le plein écran'
    : 'Plein écran'}
  on:click={() => {
    isFullScreen = !isFullScreen
    setFullScreen(isFullScreen)
  }}
>
  <div class="px-2">
    <TwoStatesIcon isOnStateActive={isFullScreen}>
      <i
        slot="icon_to_switch_on"
        class="bx bx-fullscreen text-3xl hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
      />
      <i
        slot="icon_to_switch_off"
        class="bx bx-exit-fullscreen text-3xl hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
      />
    </TwoStatesIcon>
  </div>
</button>

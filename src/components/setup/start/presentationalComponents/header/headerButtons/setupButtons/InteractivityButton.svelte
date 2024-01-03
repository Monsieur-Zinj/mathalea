<script lang="ts">
  import TwoStatesIcon from '../../../../../../../components/shared/icons/TwoStatesIcon.svelte'

  export let setAllInteractive: (isAllInteractive: boolean) => void
  let isAllInteractive: boolean = false

</script>

<button
  type="button"
  on:click={() => {
    isAllInteractive = !isAllInteractive
    setAllInteractive(isAllInteractive)
  }}
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip={isAllInteractive
    ? "Supprimer l'interactivité"
    : 'Tous les exercices en interactif'}
>
  <div class="px-2">
    <TwoStatesIcon
      isOnStateActive={isAllInteractive}
      size={7}
    />
  </div>
</button>

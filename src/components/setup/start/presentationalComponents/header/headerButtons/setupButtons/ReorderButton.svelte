<script lang="ts">
  import ButtonIconTooltip from '../../../../../../shared/forms/ButtonIconTooltip.svelte'
  export let reorderModalDisplayed: boolean

</script>

<ButtonIconTooltip
  icon="bx-transfer text-3xl rotate-90"
  tooltip="Réorganisation"
  on:click={() => {
    reorderModalDisplayed = !reorderModalDisplayed
  }}
/>

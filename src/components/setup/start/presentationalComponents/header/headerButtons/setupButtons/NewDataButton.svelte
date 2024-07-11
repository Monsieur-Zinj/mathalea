<script lang="ts">
  import ButtonIconTooltip from '../../../../../../shared/forms/ButtonIconTooltip.svelte'

  export let newDataForAll: () => void
</script>

<ButtonIconTooltip
  icon="bx-refresh text-3xl"
  tooltip="Nouveaux énoncés"
  on:click={newDataForAll}
/>

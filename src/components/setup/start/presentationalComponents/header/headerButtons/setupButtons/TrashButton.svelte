<script lang="ts">
  import ButtonIconTooltip from '../../../../../../shared/forms/ButtonIconTooltip.svelte'

  export let trash: () => void
</script>

<ButtonIconTooltip
  icon="bx-trash text-3xl"
  tooltip="Supprimer tous les exercices"
  on:click={trash}
/>

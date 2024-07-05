<script lang="ts">
  import Button from '../../../../../../../components/shared/forms/Button.svelte'

  export let newDataForAll: () => void
</script>

<div class="tooltip tooltip-bottom" data-tip="Nouveaux énoncés">
  <Button
    text=""
    icon="bx-refresh"
    class="flex items-center text-3xl"
    on:click={newDataForAll}
  />
</div>

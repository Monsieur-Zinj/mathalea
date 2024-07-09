<script lang="ts">
  import ButtonIcon from '../../../../../../shared/forms/ButtonIcon.svelte'

  export let newDataForAll: () => void
</script>

<div class="tooltip tooltip-bottom" data-tip="Nouveaux énoncés">
  <ButtonIcon
    icon="bx-refresh"
    buttonClass="flex items-center text-3xl"
    on:click={newDataForAll}
  />
</div>
